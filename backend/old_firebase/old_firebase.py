from google.cloud import firestore
import os

def receive_old_container(path):

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = path+'//serviceAccountKey.json'
    client = firestore.Client()
    doc_ref = client.collection(u'devices') #.document(u'device1')
    docs = doc_ref.stream()
    for doc in docs:
        if doc.id == "device1":
            return doc.to_dict()



