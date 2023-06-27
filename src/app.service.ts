import { Injectable } from '@nestjs/common';
import { viewdata } from 'test/test-data';
import { MergeOptions } from './merge-util';

@Injectable()
export class AppService {
  public getGreeting(): object {
    const mergeOptions: MergeOptions<string> = {
      property: 'insertionPoint',
      value: 'myId',
      pos: 'content',
      index: 0,
      contributor: 'KARL',
      sort: 'position',
    };

    const snip = {
      evsModel: 'mySuperDuperModel000',
      viewId: 'input',
      position: 999,
    };

    const payload = {
      model: viewdata,
      snippets: [snip],
      options: mergeOptions,
    };

    return payload;
  }
}
