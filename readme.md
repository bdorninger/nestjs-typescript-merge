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

### B. Docker container

The solution is provided in a docker container.
Host and port subject to discussion.
