import { useCallback, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import Web3 from 'web3'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [isConnectedWeb3, setIsConnectedWeb3] = useState(false)
  const [value, setValue] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [message, setMessage] = useState("")
  const [addressOfMessage, setAddressOfMessage] = useState("")
  const [displayEncryptedMessage, setDisplayEncryptedMessage] = useState("")


  // load page 
  // 1. si window.ethereum
  // 2. web.eth.net getId() == 1 => ethreum, id == 42 kovan

  const connectToWeb3 = useCallback(
    async () => {
      if(window.ethereum) {
        try {
          await window.ethereum.request({method: 'eth_requestAccounts'})

          setIsConnectedWeb3(true)
        } catch (err) {
          console.log(err)
        }
      } else {
        alert("Install Metamask")
      }
    },
  )

  const signMessageWeb3 = useCallback(
    async () => {
      const web3 = new Web3(Web3.givenProvider)

      const accounts = await web3.eth.getAccounts()

      const encryptedMessage = await web3.eth.personal.sign(value, accounts[0])

      setDisplayEncryptedMessage(encryptedMessage)

    }, [value]
  )

  const recoverAddressOfMessage = useCallback(
    async () => {
      const web3 = new Web3(Web3.givenProvider)

      const addressOfMessageSender = await web3.eth.accounts.recover(message, encryptedMessage)

      setAddressOfMessage(addressOfMessageSender)

    }, [encryptedMessage, message]
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Sign Message Web3 App</h1>
        <h2>Sign Message</h2>
        {
          isConnectedWeb3
            ? <p>Connected</p>
            : <button onClick={connectToWeb3}>Connect to web3</button>
        }
        <input type="text" onChange={e => setValue(e.target.value)} />
        <button onClick={signMessageWeb3}>Sign Message</button>
        <p>{displayEncryptedMessage}</p>
        <h2>Recover Address form Encrypted Message</h2>
        <label>Encrypted Message</label>
        <input type="text" onChange={e => setEncryptedMessage(e.target.value)} />
        <label>Message</label>
        <input type="text" onChange={e => setMessage(e.target.value)} />
        <button onClick={recoverAddressOfMessage}>Recover Address from Message</button>

        <p>{addressOfMessage}</p>
      </main>
    </div>
  )
}
