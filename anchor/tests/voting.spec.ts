import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Voting} from '../target/types/voting'

describe('voting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Voting as Program<Voting>

  const votingKeypair = Keypair.generate()

  it('Initialize Voting', async () => {
    await program.methods
      .initialize()
      .accounts({
        voting: votingKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingKeypair])
      .rpc()

    const currentCount = await program.account.voting.fetch(votingKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Voting', async () => {
    await program.methods.increment().accounts({ voting: votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting.fetch(votingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Voting Again', async () => {
    await program.methods.increment().accounts({ voting: votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting.fetch(votingKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Voting', async () => {
    await program.methods.decrement().accounts({ voting: votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting.fetch(votingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voting value', async () => {
    await program.methods.set(42).accounts({ voting: votingKeypair.publicKey }).rpc()

    const currentCount = await program.account.voting.fetch(votingKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voting account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voting: votingKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voting.fetchNullable(votingKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
