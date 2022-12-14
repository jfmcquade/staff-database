import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, doc, DocumentData, collectionData, addDoc, updateDoc, deleteDoc, arrayUnion, FieldValue, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Person } from 'src/app/shared/models/person';
import { TagService } from '../tag/tag.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private peopleCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private tagService: TagService) {
    this.peopleCollection = collection(this.firestore, "people")
  }

  getAll() {
    return collectionData(this.peopleCollection) as Observable<Person[]>
  }

  async create(person: Person) {
    const docRef = await addDoc(this.peopleCollection, { ...person })
    const id = docRef.id
    updateDoc(docRef, { id, ...person })
    return docRef
  }

  update(id: string, data: Partial<Person>) {
    const docRef = doc(this.firestore, "people", id)
    return updateDoc(docRef, data)
  }

  delete(id: string) {
    const docRef = doc(this.firestore, "people", id)
    return deleteDoc(docRef)
  }

  assignTag(personId: string, tagId: string) {
    const personRef = doc(this.firestore, "people", personId)
    updateDoc(personRef, {
      tagIds: arrayUnion(tagId)
    })
  }

  async unassignTag(personId: string, tagId: string) {
    const personRef = doc(this.firestore, "people", personId)
    updateDoc(personRef, {
      tagIds: arrayRemove(tagId)
    })
    console.log("personDoc data:", (await getDoc(personRef)).data())
  }

}
