import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Voting } from "@/../anchor/target/types/voting";
import { BN, Program } from "@coral-xyz/anchor";
import { cookies } from "next/headers";

const IDL = require("@/../anchor/target/idl/voting.json");


export const OPTIONS = GET;

export async function GET(request: Request) {

    const actionMetadata: ActionGetResponse = {

        icon: "https://images.ps-aws.com/c?url=https%3A%2F%2Fd3cm515ijfiu6w.cloudfront.net%2Fwp-content%2Fuploads%2F2021%2F04%2F27111835%2FMercedes-Red-Bull-PA2.jpg",
        title: "Vote for your favorite factory",
        description: "Vote between Mercedes and Red Bull",
        label: "Vote",
        links: {
            actions: [
            {
                label: "Vote for Mercedes",
                href: "/api/vote?candidate=Crunchy",
                type: "transaction"
            },
            {
                label: "Vote for Red Bull",
                href: "/api/vote?candidate=Smooth",
                type: "transaction"
            }
        ]
        }
    };

    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS} );
}
  
export async function POST(request: Request) {

    console.log("Post Request");
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate != "Crunchy" && candidate != "Smooth") {
        return new Response("Invalid candidate",  { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const program: Program<Voting> = new Program(IDL,{connection});
    const body: ActionPostRequest = await request.json(); 
    let voter;

    try {
        voter = new PublicKey(body.account);
    } catch (error) {
        return new Response("Invalid Account", { status: 500 });
    }

    console.log("Voter: ", voter.toBase58());
    console.log("Candiate:   ", candidate);

    const instruction = await program.methods
        .vote(candidate, new BN(1))
        .accounts({
            signer : voter
        })
        .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
    })
    .add(instruction);

    const response = await createPostResponse({
        fields: {
            transaction: transaction
        }
    });

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
    
}