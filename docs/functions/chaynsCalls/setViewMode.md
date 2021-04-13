## [setViewMode](src/functions/chaynsCalls/setViewMode.ts)

Toggle exclusive mode for your current page. Some pages can be set to a full screen width using this, but that feature
is only available for certain chayns site layouts.

This function has multiple overloads:

* setViewMode(exclusive, tryFullBrowserWidth)

| Parameter | Description | Type | Required/Default |
|-----------|-------------|------|------------------|
| exclusive | Exclusive mode on/off | boolean | required |
| tryFullBrowserWidth | Try to set mode to full browser width. Only available for certain chayns site layouts | boolean | `false` |
| **@returns** | The promise of the chayns call | | |

* setViewMode(mode)

| Parameter | Description | Type | Required/Default |
|-----------|-------------|------|------------------|
| mode | The desired viewMode | ViewMode | required |
| **@returns** | The promise of the chayns call | | |

### ViewMode

| Member | Description | Value |
|--------|-------|----------|
| Regular | Regular mode, menu is shown | `0` |
| Exclusive | Exclusive mode | `2` |
| Wide | Wide view using full viewport width, only works for certain site layouts | `4` |
| Initial | Regular or exclusive, depending on administration settings | `-1` |
