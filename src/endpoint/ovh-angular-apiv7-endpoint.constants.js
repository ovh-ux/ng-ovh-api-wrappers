angular
    .module("ovh-angular-apiv7")

    /**
     *  @type {Object}
     *  @description $resource default actions.
     */
    .constant("APIV7_ENDPOINT_DEFAULT_ACTIONS", {
        query: {
            method: "GET",
            isArray: true
        },
        get: {
            method: "GET"
        },
        save: {
            method: "POST"
        },
        "delete": {
            method: "DELETE"
        },
        remove: {
            method: "DELETE"
        }
    });
