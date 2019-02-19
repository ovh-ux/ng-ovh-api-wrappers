/**
 * @ngdoc object
 * @name ng-ovh-apiv7.APIV7_FILTER_COMPARATOR
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
export const APIV7_FILTER_COMPARATOR = {
  EQUAL: '=',
  NOT_EQUAL: '<>',
  GREATER_OR_EQUAL: '>=',
  GREATER_THAN: '>',
  LESS_OR_EQUAL: '<=',
  LESS_THAN: '<',
  IN: 'in',
  LIKE: 'like',
};

/**
 * @type {Object}
 * @description Enumerates the possible sort order
 */
export const APIV7_SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export default {
  APIV7_FILTER_COMPARATOR,
  APIV7_SORT_ORDER,
};
