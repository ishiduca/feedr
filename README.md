# feedr

a personal rss reader.

download export.xml from your livedoor reader to `./source/` directory.

## Build and Run

```
$ npm run app
```

open http://localhost:3210

if you want to run on a different port, overrides `config.server.port` in `package.json`.


## Keybind

- s: next feed
- a: previous feed
- j: next entry
- k: previous entry
- r: request to rebuild crawler to server
- p: put/remove pin mark
- o: change mode pin/normal
- v: open permalink
- h: show help


## Requirements

- browserify (`npm install -g browserify`)

## Todo

see todo

## Author

ishiduca

## License

MIT
