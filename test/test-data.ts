export interface CommentedObject {
  __COMMENT__?: string;
}

export let fooData = {};
export let viewdata: any;
export let viewsnip: any;
export let viewsnip3: any;

export function initTestData() {
  fooData = {
    first: { some: 'other', val: 9 },
    second: { some: 'thing', val: 6 },
    obj: [
      { foo: 'abc', bar: 5 },
      { foo: 'xyz;', bar: 6 },
      { foo: null, bar: 0 },
      { foo: 'efg', bar: 9 },
    ],
  };

  viewdata = {
    id: 'viewdata',
    meta: {
      modelId: 'AirValve',
      modelType: 'main', // 'snip'
    },
    insertionPoint: 'top',
    content: [
      {
        viewId: 'evs-panel',
        insertionPoint: 'myId',
        header: [
          {
            viewId: 'evs-switch',
            name: 'Air valve 1',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            position: 10,
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            position: 20,
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=do_AirValve',
          },
        ],
      },
      {
        viewId: 'evs-panel',
        header: [
          {
            viewId: 'evs-switch',
            name: 'Air valve 2',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve2/;s=do_AirValve',
          },
        ],
      },
      {
        viewId: 'evs-panel',
        insertionPoint: 'myId2',
        header: [
          {
            viewId: 'evs-switch',
            position: 15,
            name: 'Air valve 3',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence',
          },
        ],
        content: [
          {
            viewId: 'evs-input-number',
            position: 10,
            insertionPoint: 'myInnerId',
            evsModel:
              'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime',
            content: [
              {
                viewId: 'evs-marker',
                evsModel:
                  'nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bAirValveActiveTime',
              },
            ],
          },
          {
            viewId: 'evs-marker',
            position: 20,
            evsModel: 'nsu=http://engelglobal.com/IMM/AirValve3/;s=do_AirValve',
          },
        ],
      },
    ],
  };

  viewsnip = {
    id: 'viewsnip',
    viewId: 'evs-panel',
    name: 'Air valve - blowing',
    insertAt: 'myId2',
    position: 22,
    content: [
      {
        viewId: 'evs-input-number',
        position: 15,
        evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
      },
      {
        viewId: 'evs-actual-number',
        position: 35,
        evsModel:
          'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
      },
    ],
  };

  viewsnip3 = {
    id: 'viewsnip3',
    viewId: 'evs-panel',
    name: 'something snippet',
    position: 22,
    content: [
      {
        viewId: 'evs-input-number',
        insertAt: 'myId31',
        position: 90,
        evsModel: 'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime',
      },
      {
        viewId: 'evs-actual-number',
        insertAt: 'myId32',
        position: 25,
        evsModel:
          'nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActualActiveTime',
      },
      {
        viewId: 'evs-actual-text',
        position: 88,
        evsModel: 'nsu=http://never',
      },
    ],
  };
}
