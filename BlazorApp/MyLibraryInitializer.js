let customLoadBootResourceIsUsed = false;
let configuredRuntime = false;
const environment = "Development123";

export function beforeStart(options) {
    // From documentation: https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/startup?view=aspnetcore-8.0#javascript-initializers
    // Called before Blazor starts.
    // For example, beforeStart is used to customize the loading process, logging level, and other options specific to the hosting model.
    console.log("JS initializer beforeStart");

    options.loadBootResource = function (type, name, defaultUri, integrity) {
        // Expect to be able to use custom boot resource loader before Blazor starts, but this is never called
        console.log("Custom loadBootResource");
        customLoadBootResourceIsUsed = true;
        return null;
    };

    options.configureRuntime = function (dotnet) {
        // Expect to be able to configure the runtime before Blazor starts, but this is never called
        console.log("Custom configureRuntime");
        configuredRuntime = true;
    }

    // Expect to be able to set environment before Blazor starts, but this is not passed on to dotnet
    options.environment = environment;
}

export function afterStarted(blazor) {
    console.log("JS initializer afterStarted");

    if (!customLoadBootResourceIsUsed) {
        console.warn("We expect the custom boot resource loader to be used, but our loadBootResource is not called.");
    }

    if (!configuredRuntime) {
        console.warn("We expect to be able to configure the runtime before Blazor starts, but our configureRuntime is not called.");
    }

    const actualEnvironment = blazor.runtime.config.applicationEnvironment;
    if (actualEnvironment != environment) {
        console.warn("We expect the environment to be Development123, but the actual environment is " + actualEnvironment);
    }
}