import { createAction } from './utils';

export const r_saveCode = createAction(code => ({code}), 'r_CodeEditor.saveCode');