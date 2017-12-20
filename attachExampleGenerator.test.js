const { RavlError } = require('./error');
const { isFalsy, typeOf } = require('./common');
const dict = require('./schema');
const attachExampleGenerator = require('./attachExampleGenerator');

attachExampleGenerator(dict);

// ATTACHING USER DEFINED SCHEMAS
{
    const type = 'companyName';
    const schema = {
        doc: {
            name: 'Company names',
            description: 'Loads validator from string',
            example: ['apple', 'microsoft', 'google', 'amazon'],
        },
        extends: 'string',
    };
    dict.put(type, schema);
}
{
    const name = 'district';
    const schema = {
        doc: {
            name: 'District',
            description: 'User type containing information related  a district.',
            note: 'A district can be assigned with one more officer if required.',
        },
        fields: {
            id: { type: 'uint', required: true },
            index: { type: 'number', required: false },
            name: { type: 'string', required: true },
            description: { type: 'string', required: false },
            officerAssigned: { type: 'officer', required: false },
        },
        validator: (self, context) => {
            if (isFalsy(self.description)) {
                return;
            }
            if (!typeOf(self.description) === 'string') {
                throw new RavlError('Value must be of type \'string\'', context);
            }
            if (self.description.length <= 5) {
                throw new RavlError('Length must be greater than 5', context);
            }
        },
    };
    dict.put(name, schema);
}
{
    const name = 'officer';
    const schema = {
        doc: {
            name: 'District Officer',
            description: 'User type containing information related an officer.',
        },
        fields: {
            id: { type: 'uint', required: true },
            name: { type: 'string', required: false },
            wards: { type: 'array.companyName', required: true },
        },
    };
    dict.put(name, schema);
}


test('schema of companyName', () => {
    expect(dict.getExample('companyName', 1, false)).toEqual('apple');
});

test('schema of district', () => {
    expect(dict.getExample('district', 1, false)).toEqual({
        id: 1,
        index: 1,
        name: 'ram',
        description: 'ram',
        officerAssigned: { id: 1, name: 'ram', wards: ['apple'] },
    });
});


test('schema of officer', () => {
    expect(dict.getExample('officer', 1, false)).toEqual({
        id: 1, name: 'ram', wards: ['apple'],
    });
});
