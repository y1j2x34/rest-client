import createRequireParameterFilter from './createRequiredParameterFilter';
import createValidatorFilter from './createValidatorFilter';
import queriesFilter from './queriesFilter';
import pathVariableFilter from './pathVariableFilter';
import transformFilesParameterFilter from './transformFilesParameterFilter';
import createDefaultValueFilter from './createDefaultValueFilter';

export const filters = {
    validateRequired: createRequireParameterFilter,
    validatetor: createValidatorFilter,
    defaultValue: createDefaultValueFilter,
    queries: () => queriesFilter,
    pathVariable: () => pathVariableFilter,
    files: () => transformFilesParameterFilter,
};
