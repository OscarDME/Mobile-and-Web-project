import React, { useCallback, useState, useEffect } from 'react';
import '../styles/chat.css';
import { getFirestore, collection, query, where, getDocs, doc, orderBy, onSnapshot } from "firebase/firestore"; 
import { useMsal } from "@azure/msal-react";

export default function Chat({ reciever }) {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const sender = activeAccount.idTokenClaims.oid; // OID del usuario actual
  const [message, setMessage] = useState([]); // Almacenará los mensajes de la conversación
  const [messages, setMessages] = useState([]); // Almacenará los mensajes de la conversación

  const db = getFirestore();

  console.log("reciever " + reciever);
  console.log("sender "+ sender);



  useEffect(() => {
    let unsubscribe = () => {}; // Función para desuscribirse del listener

    const fetchConversationAndSubscribeToMessages = async () => {
      const conversationsRef = collection(db, "conversaciones");
      const q = query(conversationsRef, where("participantes", "array-contains", sender));

      // Busca la conversación una vez para obtener el ID
      const conversationsSnapshot = await getDocs(q);
      conversationsSnapshot.forEach((doc) => {
        if (doc.data().participantes.includes(reciever)) {
          const conversationId = doc.id;
          
          // Una vez encontrada la conversación, suscríbete a los cambios en los mensajes
          const messagesRef = collection(db, "conversaciones", conversationId, "mensajes");
          const messagesQuery = query(messagesRef, orderBy("enviadoEn", "asc"));
          
          unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              enviadoEn: doc.data().enviadoEn.toDate(), // Convertir Timestamp a Date
            }));
            setMessages(fetchedMessages);
          });
        }
      });
    };

    fetchConversationAndSubscribeToMessages();

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, [reciever, sender, db]);



  // Otros métodos y el JSX siguen aquí
  return (
    <>
      <div className='chat-container'>
        <div className='messages-container'>
          {/* Mostrar los mensajes */}
          {messages.map((message) => (
            <div 
                key={message.id} 
                className={`message ${message.enviadoPor === sender ? 'message-sender' : 'message-receiver'}`}
              >
              {message.texto} <div className='message-date'>{message.enviadoEn.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className='input-chat-bar'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='input-chat'
            placeholder='Escriba un mensaje y presione enter para enviarlo...'
          ></input>
        </div>
      </div>
    </>
  );
}
