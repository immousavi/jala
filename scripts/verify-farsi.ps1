# Static verification for the Jala Persian fork.
param([switch]$Quiet)

Set-Location $PSScriptRoot/..
$rows = @()
$problems = @()

$relPaths = @()
Get-ChildItem "skill/reference/*.md", "skill/agents/*.md" | ForEach-Object { $relPaths += $_ }
$relPaths += (Get-Item "skill/SKILL.src.md")

foreach ($f in $relPaths) {
  $rel = $f.FullName -replace [regex]::Escape((Get-Location).Path + '\'), '' -replace '\\', '/'
  $cur = Get-Content $f.FullName -Raw -Encoding UTF8
  $headRaw = & git show "HEAD:$rel" 2>&1
  $head = ($headRaw -join "`n")
  if ($LASTEXITCODE -ne 0 -or $head -eq "") { $rows += ("{0,-16} {1}" -f "NEW", $rel); continue }

  $headRules = ([regex]::Matches($head, '<!-- rule:')).Count
  $curRules  = ([regex]::Matches($cur,  '<!-- rule:')).Count
  $headFences = ([regex]::Matches($head, '(?m)^```')).Count
  $curFences  = ([regex]::Matches($cur,  '(?m)^```')).Count
  $headHeadings = ([regex]::Matches($head, '(?m)^#{1,6} ')).Count
  $curHeadings  = ([regex]::Matches($cur,  '(?m)^#{1,6} ')).Count

  $phOk = $true
  $phDetail = ""
  foreach ($m in [regex]::Matches($head, '\{\{[a-z_]+\}\}')) {
    $name = $m.Value
    $hc = ([regex]::Matches($head, [regex]::Escape($name))).Count
    $cc = ([regex]::Matches($cur,  [regex]::Escape($name))).Count
    if ($hc -gt $cc) { $phOk = $false; $phDetail += "$name $($hc)->$cc " }
  }

  $faCount = ([regex]::Matches($cur, '[\u0600-\u06FF]')).Count
  $status = "OK"
  if ($headRules -ne $curRules) { $status = "RULES!"; $problems += "$rel : rule markers $headRules -> $curRules" }
  if ($headFences -ne $curFences) { $status = "FENCES!"; $problems += "$rel : code fences $headFences -> $curFences" }
  if ($headHeadings -ne $curHeadings) { $status = "HEADINGS!"; $problems += "$rel : headings $headHeadings -> $curHeadings" }
  if (-not $phOk) { $status = "PLACEHOLDER!"; $problems += "$rel : placeholders lost: $phDetail" }
  if ($faCount -lt 50) { $status = "NOT-FA"; $problems += "$rel : only $faCount Persian chars" }
  $rows += ("{0,-12} {1}" -f $status, $rel)
}

foreach ($f in (Get-ChildItem "skill/reference/*.md", "skill/agents/*.md")) {
  $cur = Get-Content $f.FullName -Raw -Encoding UTF8
  if ($cur.Contains('{{command_prefix}}impeccable')) { $problems += "$($f.Name): leftover {{command_prefix}}impeccable" }
}

$rows
""
if ($problems.Count -eq 0) { "ALL CHECKS PASSED" } else { "PROBLEMS ($($problems.Count)):"; $problems }
