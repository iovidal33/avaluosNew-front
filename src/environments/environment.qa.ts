// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
*Rutas utilizadas para el testeo en el ambiente de qa
*/
export const environment = {
    production: false,
    closeSession: true,
    appName: 'avaluos',
    baseHref: '/avaluos',
    endpoint: 'http://ovica.linesolutions.tech/avaluosNew_backend/public/api/v1/',
    //endpoint: 'http://ovica.linesolutions.tech/avaluos-backend/public/api/v1/',
    ssoRemember: 'http://ovica.linesolutions.tech/sso/recordar-password',
    ssoEndpoint: 'http://ovica.linesolutions.tech/sso-backend/public/api/v1/',
    rconEndpoint: 'http://ovica.linesolutions.tech/rcon-backend/public/api/v1/',
    ssoToken: 'eyJpdiI6IkxoK0I2MkF3NnkrTFBSZzNxUStBeEE9PSIsInZhbHVlIjoiM2ErdFJKajFSWTlHZExyK0ZzOC9BMXMyTnlsbVNEM083eDRJOGJ2bTVwanZ2WnVXQWhuUENSMVBTbkRLajdyS2V4bFZySzBxRkxGUFltU085dWRvekVmTDB4YjlBeHZEREdTMFRsWkltU3JLZXoyd21HaEVKK3F0R25zYVkwRkUwUm9TZE1BNDkweVk5bncwQnhEKzFEUHV4N0FvTFkxMHBnK2t2YnhkZjAzd0tvM2pRT0pIWEZYV05UV051eHFLcDFsaE1YV1gvQ1pnV2YrTVhuK2p2Mm8yWEw3U3dRMmpIY3dHZHhPQ1RkanVGWFVNZDA4Y1VoK1A5VEhiSm9oRm9wMkxSYmhjanRkaGFLbXMzVVBMUEUwTzF1c3NwejlDd3dud2YyMzh4RmtTVm9jV3o5bXRmT1I2NDB6c3laMDFKeFFkdzZkMDFsY0R4UVI5Slpnek8rek52SE9Id1dnVXdvRlo5Q1cvOW5PdVJDcnpUVXVIZ0FCUVdMTndrdVZjV2xrU2V4RStYSHdYMGhkRUV6bk95bno2ZjZoTTRjcTB6Z1NRdXhROGlvRDd4d29IKzVoREhvbDRqRWF0eHlhb3BWRlNQdXNibVNuSDB3TGFFT0xIVFE9PSIsIm1hYyI6ImI2NDU3ZjZhYWE5M2YzNjQ3ZmU2MTA3ZTYxODE4MjlkZGJhYWQ0MzkxMWJlNzE5NzA3ZjkxYmRlYThkZDExOTAifQ==',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
