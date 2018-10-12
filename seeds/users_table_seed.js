exports.seed = function (knex, Promise) {
    return knex('projects').del() // Deletes ALL existing entries
        .then(function () { // Inserts seed entries one by one in series
            return knex('users').insert({
                role: 'admin',
                username: 'Torbjørn',
                untappd_id: '1',
                created_at: '2018-10-12 20:21',
                updated_at: '2018-10-12 20:23',
            });
        }).then(function () {
            return knex('users').insert({
                role: 'admin',
                username: 'Torgeir',
                untappd_id: '2',
                created_at: '2018-10-12 20:23',
                updated_at: '2018-10-12 21:23',
            });
        }).then(function () {
            return knex('users').insert({
                role: 'user',
                username: 'Fredrik',
                untappd_id: '1351',
                created_at: '2018-10-12 22:23',
                updated_at: '2018-10-12 00:23',
            })
        });
    };