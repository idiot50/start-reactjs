fs = require('fs')
path = require('path')

module.exports = {
    add: function (module, feature) {
        try {
            let desDir = path.resolve("./src/parts/" + module + "/" + feature);
            fs.mkdirSync(desDir, { recursive: true });

            let fileName = this.capitalizeFirstLetter(module) + this.capitalizeFirstLetter(feature);

            let sourceDir = path.resolve("./src/parts/od/category");
            // destination.txt will be created or overwritten by default.
            fs.copyFile(sourceDir + '/OdTypeActions.js', desDir + "/" + fileName + "Actions" + ".js", (err) => {
                if (err) throw err;
                console.log('Action file is created!');

                // Replace all
                let that = this;
                fs.readFile(desDir + "/" + fileName + "Actions" + ".js", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(desDir + "/" + fileName + "Actions" + ".js", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });
            fs.copyFile(sourceDir + '/OdTypeAddEdit.js', desDir + "/" + fileName + "AddEdit" + ".js", (err) => {
                if (err) throw err;
                console.log('AddEdit file is created!');

                // Replace all
                let that = this;
                fs.readFile(desDir + "/" + fileName + "AddEdit" + ".js", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(desDir + "/" + fileName + "AddEdit" + ".js", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });
            fs.copyFile(sourceDir + '/OdTypeList.js', desDir + "/" + fileName + "List" + ".js", (err) => {
                if (err) throw err;
                console.log('List file is created!');

                // Replace all
                let that = this;
                fs.readFile(desDir + "/" + fileName + "List" + ".js", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(desDir + "/" + fileName + "List" + ".js", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });
            fs.copyFile(sourceDir + '/OdTypeReducer.js', desDir + "/" + fileName + "Reducer" + ".js", (err) => {
                if (err) throw err;
                console.log('Reducer file is created!');

                // Replace all
                let that = this;
                fs.readFile(desDir + "/" + fileName + "Reducer" + ".js", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(desDir + "/" + fileName + "Reducer" + ".js", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });
            fs.copyFile(sourceDir + '/OdTypeTypes.js', desDir + "/" + fileName + "Types" + ".js", (err) => {
                if (err) throw err;
                console.log('Types file is created!');

                // Replace all
                let that = this;
                fs.readFile(desDir + "/" + fileName + "Types" + ".js", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(desDir + "/" + fileName + "Types" + ".js", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });

            // Language File
            // destination.txt will be created or overwritten by default.
            let langDir = path.resolve("./public/locales");
            let langFileName = module + this.capitalizeFirstLetter(feature);
            fs.copyFile(langDir + "/en_US" + '/OdType.json', langDir + "/en_US/" + langFileName + ".json", (err) => {
                if (err) throw err;
                console.log('Action file is created!');

                // Replace all
                let that = this;
                fs.readFile(langDir + "/en_US/" + langFileName + ".json", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(langDir + "/en_US/" + langFileName + ".json", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });
            fs.copyFile(langDir + "/vi_VN" + '/OdType.json', langDir + "/vi_VN/" + langFileName + ".json", (err) => {
                if (err) throw err;
                console.log('Action file is created!');

                // Replace all
                let that = this;
                fs.readFile(langDir + "/vi_VN/" + langFileName + ".json", 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/OD_TYPE/g, (module + "_" + feature).toUpperCase());
                    result = result.replace(/OdType/g, that.capitalizeFirstLetter(module) + that.capitalizeFirstLetter(feature));
                    result = result.replace(/odType/g, module + that.capitalizeFirstLetter(feature));
                    fs.writeFile(langDir + "/vi_VN/" + langFileName + ".json", result, 'utf8', function (err) {
                        if (err) return console.log(err);
                    });
                });
            });

            // Insert reducer
            let reducerDir = path.resolve("./src/reducers");
            let data = fs.readFileSync(reducerDir + "/" + 'index.js').toString().split("\n");
            let moduleName = module + this.capitalizeFirstLetter(feature);
            data.splice(9, 0, "import " + moduleName + " from '../parts/" + module + "/" + feature + "/" + fileName + "Reducer" + "';");
            var text = data.join("\n");

            fs.writeFile(reducerDir + "/" + 'index.js', text, function (err) {
                if (err) return console.log(err);
            });

            // Insert routes
            let routesDir = path.resolve("./src");
            let data1 = fs.readFileSync(routesDir + "/" + 'routes.js').toString().split("\n");
            let loadable = "const " + fileName + " = Loadable({\n"
            loadable += "  loader: () => import('./parts/" + module + "/" + feature + "/" + fileName + "List" + "'),\n"
            loadable += "  loading: Loading,\n"
            loadable += "});"
            data1.splice(15, 0, loadable);
            var text1 = data1.join("\n");

            fs.writeFile(routesDir + "/" + 'routes.js', text1, function (err) {
                if (err) return console.log(err);
            });

        } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
        return module + feature
    },

    capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

};

require('make-runnable');
