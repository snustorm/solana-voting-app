#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod voting {
    use super::*;

  pub fn close(_ctx: Context<CloseVoting>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting.count = ctx.accounts.voting.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voting.count = ctx.accounts.voting.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVoting>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.voting.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVoting<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Voting::INIT_SPACE,
  payer = payer
  )]
  pub voting: Account<'info, Voting>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVoting<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub voting: Account<'info, Voting>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub voting: Account<'info, Voting>,
}

#[account]
#[derive(InitSpace)]
pub struct Voting {
  count: u8,
}
