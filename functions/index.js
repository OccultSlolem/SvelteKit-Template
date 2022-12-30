const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");

admin.initializeApp();

const SETTINGS = {
  generateDisplaynames: true
}
const NAMES = JSON.parse(fs.readFileSync("./names.json"));

/**
 * Allows you to query multiple documents for creation, editing, or deletion.
 *
 * @param {"CREATE" | "EDIT" | "DELETE"} type Type of operation to do.
 * @param {[string]} paths The paths of the documents to create. .
 * @param {[{}]} datas The data to insert in each document. Must be one-to-one with paths.
 * @note If type == "CREATE" || type == "EDIT", paths and datas must be one-to-one with each other.
 * @resolves True if all jobs were completed successfully. False if (ANY document failed to create || ANY malformed or null input).
 */
const queryDocumentActions = (type, paths, datas) => {
  return new Promise(async (resolve, reject) => {
    const throwVars = (err) => {
      warnMayBeIntentional(err)
      functions.logger.debug(`Paths: ${paths}\nDatas: ${datas}`)
      resolve(false)
    }
    if (
      (type === 'CREATE' || type === 'EDIT') &&
      paths.length !== datas.length
    ) {
      throwVars('Paths and datas are not one-to-one')
    }
    if (paths.length == 0) {
      throwVars('No inputs were provided.')
    }
    if (paths.length !== new Set(paths).size) {
      throwVars('Duplicate paths were provided.')
    }
    if (typeof type !== 'string' || typeof paths !== 'object' || typeof datas !== 'object') {
      throwVars('Incorrect input type.')
    }
    if (paths.length > 500) {
      throwVars('Too many inputs were provided.')
    }

    const promises = []
    const allTasksSuccessful = true

    paths.forEach((path, i) => {
      switch (type) {
        case 'CREATE':
          promises.push(admin.firestore().doc(path).create(datas[i]))
          break
        case 'EDIT':
          promises.push(admin.firestore().doc(path).set(datas[i]))
          break
        case 'DELETE':
          promises.push(admin.firestore().doc(path).delete())
          break
        default:
          warnMayBeIntentional(`Incorrect type: ${type}`)
          reject()
      }
    })

    try {
      await Promise.all(promises)
      resolve(allTasksSuccessful)
    } catch (err) {
      functions.logger.error(err)
      allTasksSuccessful = false
      reject(err)
    }
  })
}

/**
 * Gets a document from Firestore. Automatically rejects and logs if the
 * request fails, so unless you need to perform custom logic there is no
 * need to check for value existence or log any catches.
 *
 * @param {string} path Path of the document to get.
 */
const getDoc = (path) => {
  return new Promise(async (resolve, reject) => {
    if (!path) {
      functions.logger.error('No input was provided.')
      reject()
    }
    await admin
      .firestore()
      .doc(path)
      .get()
      .then((val) => {
        if (!val.exists || !val.data()) {
          reject('No data')
        }
        resolve(val)
      })
      .catch((err) => {
        functions.logger.error(err)
        reject(err)
      })
  })
}

/**
 * Reads ./names.json, pick an adjective and noun, and return them as a string.
 * @returns {string} adjective noun
 * @example "silly cat"
 */ 
function generateName() {
  const adj = NAMES.adjectives[Math.floor(Math.random() * NAMES.adjectives.length)]
  const noun = NAMES.nouns[Math.floor(Math.random() * NAMES.nouns.length)]
  return `${adj} ${noun}`
}

/**
 * Triggers on user creation. Creates Firestore documents for user.
 */
exports.onCreate = functions.auth.user().onCreate(async (user) => {
  const uid = user.uid;
  const email = user.email;
  const displayName = SETTINGS.generateDisplaynames ? generateName() : null
  
  queryDocumentActions('CREATE', [
    `users/${uid}`,
    `users/${uid}/private/settings`,
    `users/${uid}/private/permissions`,
  ], [
    {
      // users/{uid}
      uid: uid,
      displayName: displayName,
    },
    {
      // users/{uid}/private/settings
      analyticsConsent: false,
      email: email,
      photoURL: null,
      creationTime: Math.floor(Date.now() / 1000),
    },
    {
      // users/{uid}/private/permissions
      admin: false,
      moderator: false,
    }
  ]);

  // Set user display name
  if (displayName) {
    admin.auth().updateUser(uid, {
      displayName: displayName
    })
  }
});

exports.updateDisplayName = functions.https.onCall((data, context) => {
  return new Promise((resolve, reject) => {
    if (!context.auth) {
      resolve('failed');
      return;
    }
  
    const uid = context.auth.uid;
    const displayName = data.displayName;
  
    if (!displayName) {
      resolve('failed');
      return;
    }
    if (typeof displayName != "string" || displayName.length < 3 || displayName.length > 20) {
      resolve('failed');
      return;
    }

    admin.auth().updateUser(uid, {
      displayName: displayName
    });

    admin.firestore().doc(`users/${uid}`).update({
      displayName: displayName
    })
    .then(() => {
      resolve('success');
    })
    .catch((err) => {
      functions.logger.error(err);
      reject(err);
    });
  })
})