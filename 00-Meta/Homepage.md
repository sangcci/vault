# 최근 노트

```dataview
TABLE file.folder as "분류", file.mtime as "수정일"
FROM ""
WHERE file.folder != "99-Daily"
  AND file.folder != "00-Meta"
  AND file.folder != "98-Temp"
  AND !contains(file.path, ".claude")
SORT file.mtime DESC
LIMIT 10
```

# 오늘의 Task
### 단기 Task
```dataview
TASK
FROM "00-Meta/TODO.md"
WHERE !completed
```
### 장기 Task
```dataview
LIST L.text
FROM "00-Meta/TODO.md"
FLATTEN file.lists AS L
WHERE meta(L.section).subpath = "Long-Term Plan"
```
