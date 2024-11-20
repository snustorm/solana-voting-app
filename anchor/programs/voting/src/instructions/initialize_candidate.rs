use anchor_lang::prelude::*;

use crate::{Candidate, Poll};


#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        init,
        payer = signer,
        space = 8 + Candidate::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump,
    )]
    pub candidate_account: Account<'info, Candidate>,

    pub system_program: Program<'info, System>,

}

pub fn process_initialize_candidate(ctx: Context<InitializeCandidate>,
     candidate_name: String,
     _poll_id: u64,
    ) -> Result<()> {

    let candidate = &mut ctx.accounts.candidate_account;
    candidate.candidate_name = candidate_name;
    candidate.candidate_votes = 0;
    
    let poll = &mut ctx.accounts.poll;
    poll.candidate_amount += 1;
    
    Ok(())
}