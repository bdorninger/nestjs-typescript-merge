## Model Merge Tool Service API

### A. Endpoint Definitions

#### 1. Merge

- name: `/merge`
- method: `POST`
- Content-Type: `application/json`

  ```
  {
    "model": <M>,
    "snippets": <S[]>,
    "options": <MergeOptions>
  }
  ```

**returns in case of success**

- HTTP code: `200/OK`
- Content-Type: `application/json`

  Result json structure:

  ```
  {
    "mergedModel": <M>
  }
  ```

**returns in case of error**

- HTTP code 400: in case of any error in the provided data (missing model/snippet/options, corrupt objects,....)
- HTTP code 500: processing failure on server

**++Sample++**:

```
{
  "model": {...},
  "snippets": [...],
  "options": {...}
}
```

**To test it, execute this code - URL might need correction!**
```
fetch('https://nestjstypescriptstarterl832rw-zszc--3000--a19575a2.local-credentialless.webcontainer.io/merge', {
  method: 'POST',
  body: JSON.stringify(
  {
  "model": {
    "id": "viewdata",
    "meta": {
      "modelId": "AirValve",
      "modelType": "main"
    },
    "insertionPoint": "top",
    "content": [
      {
        "viewId": "evs-panel",
        "insertionPoint": "myId",
        "header": [
          {
            "viewId": "evs-switch",
            "name": "Air valve 1",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bActivatedInSequence"
          }
        ],
        "content": [
          {
            "viewId": "evs-input-number",
            "position": 10,
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_rActiveTime",
            "content": [
              {
                "viewId": "evs-marker",
                "evsModel": "nsu=http://engelglobal.com/IMM/AirValve1/;s=sv_bAirValveActiveTime"
              }
            ]
          },
          {
            "viewId": "evs-marker",
            "position": 20,
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve1/;s=do_AirValve"
          }
        ]
      },
      {
        "viewId": "evs-panel",
        "header": [
          {
            "viewId": "evs-switch",
            "name": "Air valve 2",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bActivatedInSequence"
          }
        ],
        "content": [
          {
            "viewId": "evs-input-number",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_rActiveTime",
            "content": [
              {
                "viewId": "evs-marker",
                "evsModel": "nsu=http://engelglobal.com/IMM/AirValve2/;s=sv_bAirValveActiveTime"
              }
            ]
          },
          {
            "viewId": "evs-marker",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve2/;s=do_AirValve"
          }
        ]
      },
      {
        "viewId": "evs-panel",
        "insertionPoint": "myId2",
        "header": [
          {
            "viewId": "evs-switch",
            "position": 15,
            "name": "Air valve 3",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bActivatedInSequence"
          }
        ],
        "content": [
          {
            "viewId": "evs-input-number",
            "position": 10,
            "insertionPoint": "myInnerId",
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_rActiveTime",
            "content": [
              {
                "viewId": "evs-marker",
                "evsModel": "nsu=http://engelglobal.com/IMM/AirValve3/;s=sv_bAirValveActiveTime"
              }
            ]
          },
          {
            "viewId": "evs-marker",
            "position": 20,
            "evsModel": "nsu=http://engelglobal.com/IMM/AirValve3/;s=do_AirValve"
          }
        ]
      }
    ]
  },
  "snippets": [
  meta: {
		deps: [Mold]
  }
    {
      "evsModel": "mySuperDuperModel000",
      "viewId": "input",
      "position": 999
    },
	{
      "evsModel": "ANOTHERModel123",
      "viewId": "input",
      "position": 666
    },
	{
      "evsModel": "myFINESTModel464",
      "viewId": "input",
      "position": 555
    }
  ],
  "options": {
    "property": "insertionPoint",
    "value": "myId",
    "pos": "content",
    "index": 0,
    "contributor": "KARL",
    "sort": "position"
  }
}
  ),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)
```


### B. Docker container

The solution is provided in a docker container.
Host and port subject to discussion.
