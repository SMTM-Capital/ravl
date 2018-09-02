import { isFalsy } from './utils';
import RavlError from './RavlError';
import Dict from './Dict';

test('should check Dict.has', () => {
    const dict = new Dict();

    dict.put('base32', { doc: { name: 'base32' }, fields: {}});
    dict.put('extension32', { doc: { name: 'extension32' }, extends: 'base32' });
    expect(dict.has('base32')).toBeTruthy();
    expect(dict.has('extension32')).toBeTruthy();
    expect(dict.has('base64')).toBeFalsy();
});

test('valid extends', () => {
    const dict = new Dict();

    const typeZero = 'something-here';
    const validatorZero = (self: any) => {
        if (isFalsy(self.description)) {
            throw new RavlError('Whaat?');
        }
    };
    const schemaZero = {
        doc: {
            name: 'Something',
            description: 'This has something',
            example: ['something'],
        },
        fields: {
            id: { type: 'uint', required: true },
            description: { type: 'string', required: false },
        },
        validator: validatorZero,
    };
    dict.put(typeZero, schemaZero);

    const type = 'companyName';
    const validator = (self: any) => {
        if (isFalsy(self.name)) {
            throw new RavlError('Whaat?');
        }
    };
    const schema = {
        doc: {
            name: 'Company names',
            description: 'Loads validator from string',
            example: ['apple', 'microsoft', 'google', 'amazon'],
        },
        fields: {
            description: { type: 'string', required: true },
        },
        extends: 'something-here',
        validator,
    };
    dict.put(type, schema);

    const op = {
        doc: {
            name: 'Company names',
            description: 'Loads validator from string',
            example: ['apple', 'microsoft', 'google', 'amazon'],
        },
        fields: {
            id: { type: 'uint', required: true },
            description: { type: 'string', required: true },
        },
        validator,
    };
    expect(dict.get('companyName')).toEqual(op);
});

test('no fields extends', () => {
    const dict = new Dict();

    expect(() => dict.get(type)).toThrow();

    const validator = (self: any) => {
        if (isFalsy(self.name)) {
            throw new RavlError('Whaat?');
        }
    };
    const type = 'companyName';
    const schema = {
        doc: {
            name: 'Company names',
            description: 'Loads validator from string',
            example: ['apple', 'microsoft', 'google', 'amazon'],
        },
        fields: {},
        extends: 'something-not-here',
        validator,
    };
    expect(() => dict.put(type, schema)).toThrow();

});