import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Voting} from '../target/types/voting'
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import { before } from 'node:test';


const IDL = require('../target/idl/voting.json');

describe('voting', () => {

    // Testing use bankrun 

   const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");
   let context;
   let provider;
   let votingPrgoram: anchor.Program<Voting>;

   beforeAll(async () => {

    context = await startAnchor("", [{name: "voting", programId: votingAddress}], []);
    provider = new BankrunProvider(context);    

    votingPrgoram = new Program<Voting>(
        IDL,
        provider,
    )

   })

  it('Initialize Vote', async () => {
    
    await votingPrgoram.methods.initializePoll(
        new anchor.BN(1),
        "description",
        new anchor.BN(1732096258),
        new anchor.BN(1832096258),
    ).accounts({})
    .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
        votingAddress
    )

    const poll = await votingPrgoram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("description");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });

  it("initialize candidate", async () => {

    await votingPrgoram.methods.initializeCandidate(
        "Smooth",
        new anchor.BN(1),
    ).accounts({})
    .rpc();

    await votingPrgoram.methods.initializeCandidate(
        "Crunchy",
        new anchor.BN(1),
    ).accounts({})
    .rpc();

    const [crunckyAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
        votingAddress
    )

    const crunckyCandidate = await votingPrgoram.account.candidate.fetch(crunckyAddress);
    console.log(crunckyCandidate);
  });


  it("voting", async () => {
     
    await votingPrgoram.methods.vote(
        "Smooth",
        new anchor.BN(1),
    ).accounts({})
    .rpc();

    const [smoothAddress] = PublicKey.findProgramAddressSync(
        [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Smooth")],
        votingAddress
    );

    const smoothCandidate = await votingPrgoram.account.candidate.fetch(smoothAddress);

    console.log(smoothCandidate);

    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);

  });




  
})
