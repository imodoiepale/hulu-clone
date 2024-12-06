import { NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server";
import { db } from '@/utils/firebase'
import { collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const favoritesRef = collection(db, 'favorites')
  const q = query(favoritesRef, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  const favorites = querySnapshot.docs.map(doc => doc.data().movieId)

  return NextResponse.json({ favorites })
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { movieId } = await req.json()
  const favoritesRef = collection(db, 'favorites')
  await addDoc(favoritesRef, { userId, movieId })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { userId } = auth()
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { movieId } = await req.json()
  const favoritesRef = collection(db, 'favorites')
  const q = query(favoritesRef, where('userId', '==', userId), where('movieId', '==', movieId))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref)
  })

  return NextResponse.json({ success: true })
}

