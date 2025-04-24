import React from 'react'
import "./AccessDeniedPage.css"

export default function AccessDeniedPage({ errorMessage }) {
  return (
    <div className='access-denied-container'>
      <img src="/assets/AccessDenied.jpg" />
      <p>{errorMessage? errorMessage : "Access Denied"}</p>
    </div>
  )
}
