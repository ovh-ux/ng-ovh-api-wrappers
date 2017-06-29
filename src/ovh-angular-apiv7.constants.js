angular
    .module("ovh-angular-apiv7")

    /**
     * @ngdoc object
     * @name ovh-angular-apiv7.APIV7_FILTER_COMPARATOR
     * @type {Object}
     * @description
     *  The possible comparators for filtering with APIv7:
     *
     *  - EQUAL: =
     *  - NOT_EQUAL: <>
     *  - GREATER_OR_EQUAL: >=
     *  - GREATER_THAN: >
     *  - LESS_OR_EQUAL: <=
     *  - LESS_THAN: <
     *  - IN: in
     *  - LIKE: like
     *
     */
    .constant("APIV7_FILTER_COMPARATOR", {
        EQUAL: "=",
        NOT_EQUAL: "<>",
        GREATER_OR_EQUAL: ">=",
        GREATER_THAN: ">",
        LESS_OR_EQUAL: "<=",
        LESS_THAN: "<",
        IN: "in",
        LIKE: "like"
    })

    /**
     * @type {Object}
     * @description Enumerates the possible sort order
     */
    .constant("APIV7_SORT_ORDER", {
        ASC: "ASC",
        DESC: "DESC"
    });
