# Research Data Viewer (RDV)

## Configuration

The application is highly configurable by providing a configuration file. A couple of examples
can be found in `src/environments`:

* `elastic` (default) und `production` (production-ready, i.e. optimized for performance)
* `freidok` and `freidok-prod` (production-ready)
* `bwsts` and `bwsts-prod` (production-ready)
* `elastic-mh` and `elastic-mh-prod` (production-ready)

In order to use another configuration than the default one, start the server with the `-c` option and 
provide the name of the desired configuration, e.g. `ng serve -c freidok-prod`.

### Additional configurations

1. Copy an existing configuration and change the deviating values
2. In the `angular.json` file, add respective configuration blocks in the `targets` where you want to use
your new configuration (i.e. at least the `build` and `serve` targets with paths 
`targets.build.configurations.new_config` and `targets.serve.configurations.new_config`).

An example configuration:

```json
{
  "targets": {
    "build": {
      "configurations": {
        "new_config": {
          "optimization": true,
          "outputHashing": "all",
          "sourceMap": false,
          "extractCss": true,
          "namedChunks": false,
          "aot": true,
          "extractLicenses": true,
          "vendorChunk": false,
          "buildOptimizer": true,
          "fileReplacements": [
            {
              "replace": "src/environments/environment.ts",
              "with": "src/environments/environment.new_config.ts"
            }
          ]
        }
      }
    } 
  }
}
```

Apart from `fileReplacements` all fields can be left out. To avoid repetition, you can also link
a settings block for a configuration from another target definition:

```json
{
  "targets": {
    "serve": {
      "configurations": {
        "new_config": {
          "browserTarget": "rdv:build:new_config"
        }
      }
    }
  }
}
```

__Beware__: If you adjust the index and/or the type of the Elasticsearch cluster, you have to change also the respective settings in `angularx_elasticsearch_proxy_unibas.php`.


## Building documentation

You can build documentation locally with [compodoc](https://compodoc.github.io/compodoc/):

1. Install: `yarn global add @compodoc/compodoc` or `npm -g install @compodoc/compodoc`
2. Run in application root folder: `compodoc -swp src/tsconfig.app.json`
