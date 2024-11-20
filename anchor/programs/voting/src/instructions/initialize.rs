use anchor_lang::prelude::*;
use crate::Poll;

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {

    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll_account: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

pub fn process_initialize_poll(ctx: Context<InitializePoll>,
     poll_id: u64,
     description: String,
     poll_start: u64,
     poll_end: u64,
    ) -> Result<()> {

    let poll = &mut ctx.accounts.poll_account;
    poll.poll_id = poll_id;
    poll.description = description;
    poll.poll_start = poll_start;
    poll.poll_end = poll_end;
    poll.candidate_amount = 0;

    Ok(())
}