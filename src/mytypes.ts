import { MergeOptions } from './merge-util';

/**
 * Configuration or a particular EVS view rendering.
 *
 * It consists of two main parts:
 * 1. The {@link ViewQuery view query} to identify the view (definition) to be rendered
 * 2. The configuration parameters (e.g. input properties) for the rendered view
 *
 * If the id of the EVS view definition is known in advance, the view query can be replaced
 * by specifying the `viewId`.
 *
 * @see {@link EvsViewDefinition}
 */
export interface EvsViewConfig {
  /**
   * The id of the view (used as shortcut instead of a {@link ViewQuery} with id).
   */
  viewId?: string;

  /**
   * The input property values to be set on the view component instance.
   */
  inputs?: Record<string, unknown>;

  /**
   * Additional arbitrary properties. They will be used as input properties too,
   * but have lower precendece than those defined via {@ #inputs} object.
   * This is mainly for compatibility reasons, as the old {@link EvsTemplate}
   * defines several properties (e.g. `content`, `renderingHints`),
   * which are mainly used by EvsModelBasedView (and others).
   * In the new mechanism, the dynamically created view components use these
   * properties by themselves instead, so we have to pass them as input.
   * Future versions might remove this compatibility layer and get rid of
   * this "generic" properties.
   */
  [key: string]: any;
}

export interface MergeDTO {
  model: EvsViewConfig;
  snippets: object[];
  options: MergeOptions<any>;
}

export interface MergeResponse {
  mergedModel?: EvsViewConfig;
  success: boolean;
  message?: string;
}
