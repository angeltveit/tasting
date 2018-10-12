exports.seed = function (knex, Promise) {
    return knex('projects').del() 
        .then(function () { 
            return knex('events_participants').insert({
                event_id: '1',
                user_id: '1',
                created_at: '2018-10-12 20:21',
                updated_at: '2018-10-12 20:23',
            });
        }).then(function () {
            return knex('events_participants').insert({
                event_id: '1',
                user_id: '2',
                created_at: '2018-10-12 20:23',
                updated_at: '2018-10-12 21:23',
            });
        }).then(function () {
            return knex('events_participants').insert({
                event_id: '1',
                user_id: '1351',
                created_at: '2018-10-12 22:23',
                updated_at: '2018-10-12 00:23',
            });
        }).then(function () {
            return knex('events_participants').insert({
                event_id: '2',
                user_id: '1',
                created_at: '2018-10-12 20:21',
                updated_at: '2018-10-12 20:23',
            });
        }).then(function () {
            return knex('events_participants').insert({
                event_id: '2',
                user_id: '1351',
                created_at: '2018-10-12 22:23',
                updated_at: '2018-10-12 00:23',
            })
        });
    };