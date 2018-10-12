exports.seed = function (knex, Promise) {
    return knex('projects').del() // Deletes ALL existing entries
        .then(function () { // Inserts seed entries one by one in series
            return knex('tasting').insert({
                name: 'Woozy Hackathon',
                code: '9000',
                started_at: '2018-10-1 18:00',
                ended_at: '',
                created_by: 'fredrik',
                created_at: '2018-10-12 20:21',
                updated_at: '2018-10-12 20:23',
            });
        }).then(function () {
          return knex('tasting').insert({
                name: 'Ølsmaking 2032',
                code: '1234',
                started_at: '2032-10-1 18:00',
                ended_at: '',
                created_by: 'fredrik',
                created_at: '2032-10-12 20:21',
                updated_at: '2018-10-12 20:23',
            });
        });
    };