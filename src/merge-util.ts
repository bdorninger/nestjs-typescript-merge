import { JSONPath } from 'jsonpath-plus';

export interface FilterOptions<T extends MergeOptionValueType = string> {
  property?: string;
  value?: T;
  operator?: FilterOperator;
  useValueFromJson?: boolean;
}

export enum MergePositionIndicator {
  BEFORE = '___before___',
  AFTER = '___after___',
}

export type MergePosition = MergePositionIndicator | string; // 'before' and 'after' may have a special meaning!
export type MergeOptionValueType = number | string | boolean | null;
export type ModelType = NonNullable<object>;

export interface MergeOptions<T extends MergeOptionValueType = string>
  extends FilterOptions<T> {
  pos: MergePosition;
  value: T;
  index?: number | string;
  contributor?: string;
  sort?: string | ((o1: unknown, o2: unknown) => number);
}

export enum FilterOperator {
  EQ = '===',
  NEQ = '!==',
} // = 'eq' | 'neq';

export type RemoveOptions<T extends MergeOptionValueType = string> =
  FilterOptions<T>;

export type SelectOptions<T extends MergeOptionValueType = string> =
  FilterOptions<T>;

/**
 * Merges two models/snippets by considering the specified options
 *
 * Two basic cases are supported:
 *
 * * **case 1: before or after a specific object having a specific prop in an ARRAY**
 * * **case 2: in the content or header of an OBJECT with a specific prop**
 *
 * default merging strategy: add top level content to top content array and top level headers into top header array
 */
export function merge<
  M extends ModelType,
  O extends MergeOptionValueType = string,
>(
  modelSrc: M,
  snippet: NonNullable<object>,
  options: MergeOptions<O>,
): Promise<M> {
  return new Promise((resolve, reject) => {
    const prop = options.property ?? 'evsModel';
    const mergeRelative =
      options.pos === MergePositionIndicator.AFTER ||
      options.pos === MergePositionIndicator.BEFORE;
    const value =
      typeof options.value === 'string' ? escape(options.value) : options.value;

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const path = `$..[?(@property === '${prop}' && @ === ${value})]${
      mergeRelative ? '^' : ''
    }`;

    let mergeDone = false;

    const pathResults: any[] = JSONPath({
      json: modelSrc,
      path: path,
      wrap: true,
      callback: (_selectedValueOrProperty, _resultType, fullPayloadObject) => {
        // Do not insert a snippet multiple times, if position criteria matches more than one object!
        if (mergeDone) {
          return;
        }

        const destObject = fullPayloadObject.parent;

        // XXX: Please leave the commented diagnostic message here
        /* console.warn(
          'merge jsonpath callback:',
          path,          
          JSON.stringify(destObject,undefined, 2)
          JSON.stringify(fullPayloadObject, undefined, 2)
        );*/

        if (Array.isArray(destObject) && mergeRelative) {
          const destIndex = destObject.findIndex(
            (elem: any) => elem[prop] === options.value,
          );
          mergeDone = insertSnip(
            destObject,
            snippet,
            destIndex,
            options.pos,
            options.contributor,
          );
        } else if (
          !Array.isArray(destObject) &&
          typeof destObject === 'object'
        ) {
          mergeDone = mergeIntoArrayProperty(destObject, snippet, options);
        }

        if (mergeDone) {
          resolve(modelSrc);
        } else {
          reject(
            new Error(
              `Could not perform a merge operation with the provided options: ${JSON.stringify(
                options,
              )}`,
            ),
          );
        }
      },
    });

    // If no match is found, callback would never be called
    if (pathResults.length <= 0) {
      reject(
        new Error(
          `No destination found for merging with path ${JSON.stringify(
            options,
          )}`,
        ),
      );
    }
  });
}

/**
 * removes entries from arrays which fulfill a provided filter expression
 */
export function select<
  M extends ModelType,
  O extends MergeOptionValueType = string,
  R = any,
>(modelSrc: M, options: SelectOptions<O>): Promise<R[]> {
  return selectOrRemove(modelSrc, options, 'select');
}

/**
 * removes entries from arrays which fulfill a provided filter expression
 */
export function remove<
  M extends ModelType,
  O extends MergeOptionValueType = string,
  R = any,
>(modelSrc: M, options: RemoveOptions<O>): Promise<R[]> {
  return selectOrRemove(modelSrc, options, 'remove');
}

/**
 * Non API helper: Merges a snippet into an array property of the provided destination object.
 * The array to merge the snippet into is identified by "pos" in the options.
 *
 * If an array with that property name dioes not exist in the destination object, it is created
 *
 * **If a property with the specified name already exists in the destination object and is not an array, no merge op is performed**
 *
 * @param destinationObject a non null object recieving the snippet
 * @param snippet the snippet to insert into one of destination object's arrays
 * @param options the merge options
 * @returns true, if merge performed, false otherwise
 */
function mergeIntoArrayProperty<O extends MergeOptionValueType = string>(
  destObject: { [k: string]: unknown },
  snippet: NonNullable<object>,
  options: MergeOptions<O>,
): boolean {
  const targetArrayProperty = options.pos;
  if (destObject[targetArrayProperty] == null) {
    destObject[targetArrayProperty] = [];
  }
  // using else if --> no type inference
  if (!Array.isArray(destObject[targetArrayProperty])) {
    // throwing provide better diagnostics....
    throw new Error(
      `cannot merge into "${targetArrayProperty}". That property is present and NOT an array!`,
    );
    // return false;
  }

  let mergeDone = false;
  if (typeof options.index === 'number') {
    mergeDone = insertSnip(
      destObject[targetArrayProperty] as unknown[],
      snippet,
      options.index,
      options.pos,
      options.contributor,
    );
  } else {
    mergeDone = insertSnip(
      destObject[targetArrayProperty] as unknown[],
      snippet,
      0,
      options.pos,
      options.contributor,
    );
    // index contains the name of the property the content array is sorted
    // Contents are rendered in sequence, sorting must be done in advance
  }

  if (mergeDone && options.sort != null) {
    if (typeof options.sort === 'string') {
      const sortProp = options.sort;
      (destObject[targetArrayProperty] as any[]).sort(
        (a, b) => (a[sortProp] ?? 0) - (b[sortProp] ?? 0),
      );
    } else if (typeof options.sort === 'function') {
      const sortFn = options.sort;
      (destObject[targetArrayProperty] as any[]).sort(sortFn);
    }
  }

  return mergeDone;
}

// helper function for selecting or removing object parts
function selectOrRemove<
  M extends ModelType,
  O extends MergeOptionValueType = string,
  R = any,
>(
  modelSrc: M,
  options: RemoveOptions<O>,
  operation: 'remove' | 'select',
): Promise<R[]> {
  return new Promise<R[]>((resolver, rejector) => {
    const prop = options.property ?? 'evsModel';
    const value =
      typeof options.value === 'string' ? escape(options.value) : options.value;

    const pathExp = `$..*[?(@property==='${prop}' && @ ${
      options.operator ?? '==='
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    }${value})]^`;
    try {
      const selected: Set<R> = new Set();
      JSONPath({
        json: modelSrc,
        path: pathExp,
        wrap: true,
        callback: (_selectedValueOrProperty, _resultType, fullPayloadObject) =>
          selected.add(fullPayloadObject),
      });

      const selectedArray = Array.from(selected);
      if (operation === 'remove') {
        // reverse, otherwise indices of possibly found array elements won't be accurate!
        const removeCandidates = [...selectedArray].reverse();
        removeCandidates.forEach((remCand: any) =>
          deleteValue(remCand.parent, remCand.parentProperty),
        );
      }
      resolver(selectedArray.map((val: any) => val.value));
    } catch (err) {
      rejector(err);
    }
  });
}

//
// non api helper function for deleting
//
function deleteValue(
  parentObjectOrArray: unknown[] | object,
  propertyOrIndex: number | string,
) {
  let removed: unknown;

  if (
    Array.isArray(parentObjectOrArray) &&
    typeof propertyOrIndex === 'number'
  ) {
    removed = parentObjectOrArray.splice(propertyOrIndex, 1)[0];
  } else if (
    typeof parentObjectOrArray === 'object' &&
    typeof propertyOrIndex === 'string'
  ) {
    const p = parentObjectOrArray as Record<string | number | symbol, unknown>;
    removed = p[propertyOrIndex];
    delete p[propertyOrIndex];
  }
  return removed;
}

// helper function
function adjustIndexToArrayBounds(arr: any[], rInd: number): number {
  let ind = rInd;
  if (ind < 0) {
    ind = 0;
  }
  if (ind > arr.length) {
    ind = arr.length;
  }
  return ind;
}

/**
 * inserts a snippet
 * @param destinationArray
 * @param snippet
 * @param destinationIndex
 * @param mergePosition
 * @param contributor
 */
function insertSnip(
  destinationArray: unknown[],
  snippet: unknown,
  destinationIndex: number,
  mergePosition: MergePosition,
  contributor?: string,
): boolean {
  if (destinationArray == null || snippet == null) {
    return false;
  }
  let index = destinationIndex;
  if (mergePosition === MergePositionIndicator.AFTER) {
    index = destinationIndex + 1;
  }

  index = adjustIndexToArrayBounds(destinationArray, index);

  const snippets = Array.isArray(snippet) ? snippet : [snippet];

  if (contributor != null) {
    snippets
      .filter((snip) => snip != null)
      .forEach((snip) => (snip.contributor = contributor));
  }
  destinationArray.splice(index, 0, ...snippets);

  return true;
}

/**
 * JSONPath plus cannot handle semicolons in queries????
 */
function escape(str: string): string {
  return `'${replaceAll(str, ';', '\\u003b')}'`;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * "Backport" of replaceAll (will be avaiable from es2021)
 * @param src the string to search in
 * @param find the string to be replaced
 * @param replace the replacement
 * @returns the (possibly) modified copy of src
 */
export function replaceAll(src: string, find: string, replace: string) {
  return src.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
