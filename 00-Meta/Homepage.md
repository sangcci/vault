# 최근 노트

## Problem

```dataview
TABLE file.mtime as "수정일"
FROM "01-Problem"
SORT file.mtime DESC
LIMIT 5
```

## Principle

```dataview
TABLE file.mtime as "수정일"
FROM "02-Principle"
SORT file.mtime DESC
LIMIT 5
```

## Question

```dataview
TABLE file.mtime as "수정일"
FROM "03-Question"
SORT file.mtime DESC
LIMIT 5
```

# TODO

## 단기 Task

```dataview
TASK
FROM "00-Meta/TODO.md"
WHERE !completed
```

## 장기 Task

```dataview
LIST L.text
FROM "00-Meta/TODO.md"
FLATTEN file.lists AS L
WHERE meta(L.section).subpath = "Long-Term Plan"
```
