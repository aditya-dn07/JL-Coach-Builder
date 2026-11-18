export const singletonQuery = '*[_id in $ids && !(_id in path("drafts.**"))]{...}';
