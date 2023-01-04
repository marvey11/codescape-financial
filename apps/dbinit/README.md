# `@csfin/dbinit`

This package is mostly a helper used to populate the database from existing JSON and CSV files.

The structure of these files will wildly vary, based on whatever bank or service is being used. Therefore, this package should at best be considered a template showing how things _could_ be done.

Several lightweight service clients can be found in the `src/clients` directory. Most of these clients will only implement a single `POST` operation (`add()` or `addOne()` methods), utilising the DTOs as defined in `@csfin/core`.
