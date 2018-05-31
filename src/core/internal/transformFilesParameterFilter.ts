import { IAjaxRequestOptions } from '../types';
import FilterChain from '../FilterChain';
import { isTypedArray, mime } from '../utils';

export default function transformFilesParameterFilter(
    options: IAjaxRequestOptions,
    chain: FilterChain
) {
    if (!options.files || typeof FormData === 'undefined') {
        return chain.next(options);
    }
    const formdata = new FormData();
    let files = options.files;

    if (!(files instanceof Array)) {
        files = [files];
    }

    (files as any[]).forEach(file => {
        if (file instanceof File) {
            formdata.append((file as any).filename, file);
        } else {
            let data = file.data || file;
            const filename = file.filename || file.name;
            const partname = file.name || data.name || filename;

            if (typeof data === 'string') {
                const type =
                    mime(filename) ||
                    file.type ||
                    options.contentType ||
                    'text/plain';
                data = new Blob([data], {
                    type,
                });
            } else if (isTypedArray(data)) {
                const type =
                    mime(data) ||
                    file.type ||
                    options.contentType ||
                    'application/octet-stream';
                data = new Blob(data, {
                    type,
                });
            } else if (!(data instanceof Blob)) {
                const type =
                    mime(data) ||
                    file.type ||
                    options.contentType ||
                    'application/json';
                data = new Blob([JSON.stringify(data)], {
                    type,
                });
            }
            formdata.append(partname, data, filename);
        }
    });
    options.formdata = formdata;
    options.contentType = undefined;
    return chain.next(options);
}
