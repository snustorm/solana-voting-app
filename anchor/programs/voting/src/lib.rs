#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("HjwzYJK2FGAuXtb4rnmFP4ziwr9Ttbfqc1yoQf1HkHMi");

mod error;
mod constants;
mod state;
mod instructions;

pub use instructions::*;
pub use state::*;

#[program]
pub mod voting {

    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>, 
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        process_initialize_poll(ctx, poll_id, description, poll_start, poll_end)
    }

    pub fn initialize_candidate(ctx: Context<InitializeCandidate>, 
        candidate_name: String,
        poll_id: u64,
    ) -> Result<()> {
        process_initialize_candidate(ctx, candidate_name, poll_id)
    }

    pub fn vote(ctx: Context<Vote>, 
        _candidate_name: String, 
        _poll_id: u64) -> Result<()> {

        let candidate = &mut ctx.accounts.candidate_account;
        candidate.candidate_votes += 1;
        msg!("Votes for candidate: {}", candidate.candidate_votes);
        Ok(())
    }
}

