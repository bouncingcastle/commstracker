Demo seed files are disabled by default.

These files were moved out of `src/fluent` so `now-sdk` will not package/import demo records during normal build/install.

To re-enable demo data temporarily:
1. Move a file back into `src/fluent/` with `.now.ts` extension.
2. Build/install to the target instance.
3. Move it back here when done.
