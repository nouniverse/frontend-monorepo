import React from "react";
import { useBlockNumber } from "wagmi";
import {
  Link as RouterLink,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { css } from "@emotion/react";
import {
  ErrorBoundary,
  AutoAdjustingHeightTextarea,
} from "@shades/common/react";
import {
  array as arrayUtils,
  message as messageUtils,
} from "@shades/common/utils";
import { useAccountDisplayName } from "@shades/common/app";
import Button from "@shades/ui-web/button";
import Select from "@shades/ui-web/select";
import Dialog from "@shades/ui-web/dialog";
import AccountAvatar from "@shades/ui-web/account-avatar";
import * as Tooltip from "@shades/ui-web/tooltip";
import Spinner from "@shades/ui-web/spinner";
import {
  useProposal,
  useProposalFetch,
  useCancelProposal,
  useCastProposalVote,
  useSendProposalFeedback,
} from "../hooks/dao.js";
import useApproximateBlockTimestampCalculator from "../hooks/approximate-block-timestamp-calculator.js";
import { useWallet } from "../hooks/wallet.js";
import { Tag } from "./browse-screen.js";
import AccountPreviewPopoverTrigger from "./account-preview-popover-trigger.js";
import RichText from "./rich-text.js";
import FormattedDateWithTooltip from "./formatted-date-with-tooltip.js";
import LogoSymbol from "./logo-symbol.js";

const useFeedItems = (proposalId) => {
  const proposal = useProposal(proposalId);

  const calculateBlockTimestamp = useApproximateBlockTimestampCalculator();

  return React.useMemo(() => {
    if (proposal == null) return [];

    const feedbackPostItems =
      proposal.feedbackPosts?.map((p) => ({
        type: "feedback-post",
        id: p.id,
        bodyRichText:
          p.reason == null ? null : messageUtils.parseString(p.reason),
        support: p.supportDetailed,
        authorAccount: p.voter.id,
        timestamp: p.createdTimestamp,
        voteCount: p.votes,
      })) ?? [];

    const voteItems =
      proposal.votes?.map((v) => ({
        type: "vote",
        id: v.id,
        bodyRichText:
          v.reason == null ? null : messageUtils.parseString(v.reason),
        support: v.supportDetailed,
        authorAccount: v.voter.id,
        timestamp: calculateBlockTimestamp(v.blockNumber),
        voteCount: v.votes,
      })) ?? [];

    return arrayUtils.sortBy(
      (i) => i.timestamp,
      [...feedbackPostItems, ...voteItems]
    );
  }, [proposal, calculateBlockTimestamp]);
};

const getDelegateVotes = (proposal) =>
  proposal.votes?.reduce(
    (acc, v) => {
      const voteGroup = { 0: "against", 1: "for", 2: "abstain" }[
        v.supportDetailed
      ];
      return { ...acc, [voteGroup]: acc[voteGroup] + 1 };
    },
    { for: 0, against: 0, abstain: 0 }
  );

const ProposalMainSection = ({ proposalId }) => {
  const { data: latestBlockNumer } = useBlockNumber();
  const calculateBlockTimestamp = useApproximateBlockTimestampCalculator();

  const proposal = useProposal(proposalId);

  const [pendingFeedback, setPendingFeedback] = React.useState("");
  const [pendingSupport, setPendingSupport] = React.useState(2);

  const endBlock = proposal?.objectionPeriodEndBlock ?? proposal?.endBlock;

  const hasVotingEnded = latestBlockNumer > Number(endBlock);
  const hasVotingStarted = latestBlockNumer > Number(proposal?.startBlock);
  const isVotingOngoing = hasVotingStarted && !hasVotingEnded;

  const sendProposalFeedback = useSendProposalFeedback(proposalId, {
    support: pendingSupport,
    reason: pendingFeedback.trim(),
  });
  const castProposalVote = useCastProposalVote(proposalId, {
    support: pendingSupport,
    reason: pendingFeedback.trim(),
    enabled: isVotingOngoing,
  });

  const feedItems = useFeedItems(proposalId);

  if (proposal == null) return null;

  const startDate = calculateBlockTimestamp(proposal.startBlock);
  const endDate = calculateBlockTimestamp(endBlock);

  const delegateVotes = getDelegateVotes(proposal);

  return (
    <>
      <div css={css({ padding: "0 1.6rem" })}>
        <MainContentContainer
          sidebar={
            <div
              css={css({
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "2rem 0 6rem",
                "@media (min-width: 600px)": {
                  padding: "6rem 0",
                },
              })}
            >
              {hasVotingStarted ? (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div
                      css={css({
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        marginBottom: "2rem",
                      })}
                    >
                      <div
                        css={(t) =>
                          css({
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: t.text.sizes.small,
                            fontWeight: t.text.weights.emphasis,
                            "[data-for]": { color: t.colors.textPositive },
                            "[data-against]": { color: t.colors.textNegative },
                          })
                        }
                      >
                        <div data-for>For {proposal.forVotes}</div>
                        <div data-against>Against {proposal.againstVotes}</div>
                      </div>
                      <VotingBar
                        forVotes={Number(proposal.forVotes)}
                        againstVotes={Number(proposal.againstVotes)}
                        abstainVotes={Number(proposal.abstainVotes)}
                      />
                      <VotingBar
                        forVotes={delegateVotes?.for ?? 0}
                        againstVotes={delegateVotes?.against ?? 0}
                        abstainVotes={delegateVotes?.abstain ?? 0}
                        height="0.3rem"
                        css={css({ filter: "brightness(0.9)" })}
                      />
                      <div
                        css={(t) =>
                          css({
                            fontSize: t.text.sizes.small,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "0.5rem",
                          })
                        }
                      >
                        <div>Quorum {proposal.quorumVotes}</div>
                        <div>
                          {hasVotingEnded ? (
                            <>
                              Voting ended{" "}
                              <FormattedDateWithTooltip
                                capitalize={false}
                                relativeDayThreshold={5}
                                value={endDate}
                                day="numeric"
                                month="short"
                              />
                            </>
                          ) : hasVotingStarted ? (
                            <>
                              Voting ends{" "}
                              <FormattedDateWithTooltip
                                capitalize={false}
                                relativeDayThreshold={5}
                                value={endDate}
                                day="numeric"
                                month="short"
                              />
                            </>
                          ) : (
                            <>
                              Voting starts{" "}
                              <FormattedDateWithTooltip
                                capitalize={false}
                                relativeDayThreshold={5}
                                value={startDate}
                                day="numeric"
                                month="short"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Content
                    side="top"
                    sideOffset={5}
                    css={css({ padding: 0 })}
                  >
                    <ProposalVoteDistributionToolTipContent
                      proposalId={proposalId}
                    />
                  </Tooltip.Content>
                </Tooltip.Root>
              ) : (
                <div css={(t) => css({ fontSize: t.text.sizes.base })}>
                  Voting starts{" "}
                  <FormattedDateWithTooltip
                    capitalize={false}
                    relativeDayThreshold={5}
                    value={startDate}
                    day="numeric"
                    month="short"
                  />
                </div>
              )}

              {feedItems.length !== 0 && <ProposalFeed items={feedItems} />}

              <ProposalActionForm
                mode={isVotingOngoing ? "vote" : "feedback"}
                reason={pendingFeedback}
                setReason={setPendingFeedback}
                support={pendingSupport}
                setSupport={setPendingSupport}
                onSubmit={async () => {
                  const submit = isVotingOngoing
                    ? castProposalVote
                    : sendProposalFeedback;

                  await submit();

                  setPendingFeedback("");
                  setPendingSupport(2);
                }}
              />
            </div>
          }
        >
          <div
            css={css({
              padding: "2rem 0 3.2rem",
              "@media (min-width: 600px)": {
                padding: "6rem 0 12rem",
              },
            })}
          >
            <ProposalContent proposalId={proposalId} />
          </div>
        </MainContentContainer>
      </div>
    </>
  );
};

export const ProposalActionForm = ({
  mode,
  reason,
  setReason,
  support,
  setSupport,
  onSubmit,
}) => {
  const [isPending, setPending] = React.useState(false);

  const {
    address: connectedWalletAccountAddress,
    requestAccess: requestWalletAccess,
  } = useWallet();

  if (mode == null) throw new Error();

  return (
    <>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPending(true);
            onSubmit().finally(() => {
              setPending(false);
            });
          }}
          css={(t) =>
            css({
              borderRadius: "0.5rem",
              background: t.colors.inputBackground,
              padding: "1rem",
              "&:has(textarea:focus-visible)": { boxShadow: t.shadows.focus },
            })
          }
        >
          <AutoAdjustingHeightTextarea
            rows={1}
            placeholder="I believe..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
            css={(t) =>
              css({
                background: t.colors.inputBackground,
                fontSize: t.text.sizes.input,
                display: "block",
                color: t.colors.textNormal,
                fontWeight: "400",
                width: "100%",
                maxWidth: "100%",
                outline: "none",
                border: 0,
                padding: "0.5rem 0.7rem",
                "::placeholder": { color: t.colors.inputPlaceholder },
                "&:disabled": {
                  color: t.colors.textMuted,
                  cursor: "not-allowed",
                },
                // Prevents iOS zooming in on input fields
                "@supports (-webkit-touch-callout: none)": {
                  fontSize: "1.6rem",
                },
              })
            }
            disabled={isPending || connectedWalletAccountAddress == null}
          />
          <div
            style={{
              display: "grid",
              justifyContent: "flex-end",
              gridAutoFlow: "column",
              gridGap: "1rem",
              marginTop: "1rem",
            }}
          >
            {connectedWalletAccountAddress == null ? (
              <Button
                type="button"
                onClick={() => {
                  requestWalletAccess();
                }}
              >
                Connect wallet to give feedback
              </Button>
            ) : (
              <>
                <Select
                  aria-label="Select support"
                  width="15rem"
                  variant="default"
                  size="medium"
                  value={support}
                  onChange={(value) => {
                    setSupport(value);
                  }}
                  options={
                    mode === "vote"
                      ? [
                          { value: 1, label: "For" },
                          { value: 0, label: "Against" },
                          { value: 2, label: "Abstain" },
                        ]
                      : [
                          { value: 1, label: "Signal for" },
                          { value: 0, label: "Signal against" },
                          { value: 2, label: "No signal" },
                        ]
                  }
                  disabled={isPending}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {mode === "vote" ? "Cast vote" : "Submit feedback"}
                </Button>
              </>
            )}
          </div>
        </form>

        <div
          css={(t) =>
            css({
              marginTop: "1.6rem",
              fontSize: t.text.sizes.tiny,
              color: t.colors.textDimmed,
            })
          }
        >
          {mode === "feedback"
            ? "By giving feedback voters can signal their voting intentions to influence and help guide proposers."
            : "Gas spent on voting will be refunded."}
        </div>
      </div>
    </>
  );
};

const ProposalDialog = ({
  proposalId,
  titleProps,
  // dismiss
}) => {
  // const me = useMe();
  const proposal = useProposal(proposalId);
  const cancelProposal = useCancelProposal(proposalId);

  // const isAdmin = me != null && proposal?.proposer.id === me.walletAddress;

  if (proposal == null) return null;

  return (
    <div
      css={css({
        overflow: "auto",
        padding: "1.5rem",
        "@media (min-width: 600px)": {
          padding: "3rem",
        },
      })}
    >
      <h1
        {...titleProps}
        css={(t) =>
          css({
            color: t.colors.textNormal,
            fontSize: t.text.sizes.headerLarge,
            fontWeight: t.text.weights.header,
            lineHeight: 1.15,
            margin: "0 0 2rem",
          })
        }
      >
        Edit proposal
      </h1>
      <main>
        <Button
          danger
          onClick={() => {
            cancelProposal();
          }}
        >
          Cancel proposal
        </Button>
      </main>
    </div>
  );
};

const NavBar = ({ navigationStack, actions }) => {
  const {
    address: connectedWalletAccountAddress,
    requestAccess: requestWalletAccess,
  } = useWallet();
  const { displayName: connectedAccountDisplayName } = useAccountDisplayName(
    connectedWalletAccountAddress
  );

  return (
    <div
      css={(t) =>
        css({
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          whiteSpace: "nowrap",
          minHeight: t.navBarHeight, // "4.7rem",
        })
      }
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.2rem",
          overflow: "hidden",
        }}
      >
        {[
          {
            to: "/",
            label: <LogoSymbol style={{ width: "2.4rem", height: "auto" }} />,
          },
          ...navigationStack,
        ].map((item, index) => (
          <React.Fragment key={item.to}>
            {index > 0 && (
              <span
                css={(t) =>
                  css({
                    color: t.colors.textMuted,
                    fontSize: t.text.sizes.base,
                  })
                }
              >
                {"/"}
              </span>
            )}
            <RouterLink
              to={item.to}
              css={(t) =>
                css({
                  display: "inline-flex",
                  alignItems: "center",
                  height: "2.7rem",
                  fontSize: t.fontSizes.base,
                  color: t.colors.textNormal,
                  padding: "0.3rem 0.5rem",
                  borderRadius: "0.2rem",
                  textDecoration: "none",
                  "@media(hover: hover)": {
                    cursor: "pointer",
                    ":hover": {
                      background: t.colors.backgroundModifierHover,
                    },
                  },
                })
              }
            >
              {item.label}
            </RouterLink>
          </React.Fragment>
        ))}
      </div>
      <div
        css={(t) =>
          css({
            fontSize: t.text.sizes.base,
            padding: "0 1rem",
            ul: {
              display: "grid",
              gridAutoFlow: "column",
              gridGap: "0.5rem",
              alignItems: "center",
            },
            li: { listStyle: "none" },
          })
        }
      >
        <ul>
          {[
            ...actions,
            actions.length !== 0 && { type: "separator" },
            connectedWalletAccountAddress == null
              ? { onSelect: requestWalletAccess, label: "Connect Wallet" }
              : {
                  onSelect: () => {},
                  label: (
                    <div
                      css={css({
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      })}
                    >
                      <div>{connectedAccountDisplayName}</div>
                      <AccountAvatar
                        address={connectedWalletAccountAddress}
                        size="2rem"
                      />
                    </div>
                  ),
                },
          ]
            .filter(Boolean)
            .map((a, i) =>
              a.type === "separator" ? (
                <li
                  key={i}
                  role="separator"
                  aria-orientation="vertical"
                  css={(t) =>
                    css({
                      width: "0.1rem",
                      background: t.colors.borderLight,
                      height: "1.6rem",
                    })
                  }
                />
              ) : (
                <li key={a.label}>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={a.onSelect}
                  >
                    {a.label}
                  </Button>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
};

export const ProposalFeed = ({ items = [] }) => {
  return (
    <ul>
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          css={(t) =>
            css({
              fontSize: t.text.sizes.base,
              ":not(:first-of-type)": { marginTop: "1.6rem" },
            })
          }
        >
          <div
            css={css({
              display: "grid",
              gridTemplateColumns: "auto minmax(0,1fr)",
              gridGap: "0.6rem",
              alignItems: "center",
            })}
          >
            <div>
              <AccountPreviewPopoverTrigger accountAddress={item.authorAccount}>
                <button
                  css={(t) =>
                    css({
                      display: "block",
                      borderRadius: t.avatars.borderRadius,
                      overflow: "hidden",
                      outline: "none",
                      ":focus-visible": {
                        boxShadow: t.shadows.focus,
                      },
                      "@media (hover: hover)": {
                        ":not(:disabled)": {
                          cursor: "pointer",
                          ":hover": {
                            boxShadow: `0 0 0 0.2rem ${t.colors.borderLight}`,
                          },
                        },
                      },
                    })
                  }
                >
                  <AccountAvatar
                    transparent
                    address={item.authorAccount}
                    size="2rem"
                  />
                </button>
              </AccountPreviewPopoverTrigger>
            </div>
            <div>
              <div
                css={css({
                  display: "flex",
                  cursor: "default",
                  lineHeight: 1.2,
                })}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <AccountPreviewPopoverTrigger
                    accountAddress={item.authorAccount}
                  />{" "}
                  {item.type !== "signature" && (
                    <span
                      css={(t) =>
                        css({
                          color:
                            item.support === 0
                              ? t.colors.textNegative
                              : item.support === 1
                              ? t.colors.textPositive
                              : undefined,
                          fontWeight: "600",
                        })
                      }
                    >
                      {item.type === "feedback-post"
                        ? item.support === 2
                          ? null
                          : "signaled"
                        : item.support === 2
                        ? "abstained"
                        : "voted"}
                      {item.support !== 2 && (
                        <> {item.support === 0 ? "against" : "for"}</>
                      )}
                    </span>
                  )}
                </div>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span
                      css={(t) =>
                        css({
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: t.text.sizes.tiny,
                          color: t.colors.textDimmed,
                        })
                      }
                    >
                      {item.voteCount}
                      <svg
                        width="170"
                        height="60"
                        viewBox="0 0 170 60"
                        fill="none"
                        style={{
                          display: "inline-flex",
                          width: "1.7rem",
                          height: "auto",
                        }}
                      >
                        <path
                          data-glas
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M80 10H60V50H80V10ZM140 10H160V50H140V10Z"
                          fill="currentColor"
                          // fillOpacity="100%"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M90 0H30V10V20H0V30V40V50H10V40V30H30V40V50V60H90V50V40V30H110V40V50V60H170V50V40V30V20V10V0H110V10V20H90V10V0ZM160 50V40V30V20V10H120V20V30V40V50H160ZM80 50H40V40V30V20V10H80V20V30V40V50Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </Tooltip.Trigger>
                  <Tooltip.Content side="top" sideOffset={5}>
                    {item.voteCount}{" "}
                    {Number(item.voteCount) === 1 ? "noun" : "nouns"}{" "}
                    represented
                  </Tooltip.Content>
                </Tooltip.Root>
                {/* {item.timestamp != null && ( */}
                {/*   <span */}
                {/*     css={(t) => */}
                {/*       css({ */}
                {/*         color: t.colors.textDimmed, */}
                {/*         fontSize: t.fontSizes.small, */}
                {/*         lineHeight: 1.5, */}
                {/*       }) */}
                {/*     } */}
                {/*   > */}
                {/*     <FormattedDateWithTooltip */}
                {/*       value={item.timestamp} */}
                {/*       hour="numeric" */}
                {/*       minute="numeric" */}
                {/*       day="numeric" */}
                {/*       month="short" */}
                {/*       tooltipSideOffset={8} */}
                {/*     /> */}
                {/*   </span> */}
                {/* )} */}
              </div>
            </div>
          </div>
          {item.bodyRichText != null && (
            <RichText
              blocks={item.bodyRichText}
              css={(t) =>
                css({
                  fontSize: t.text.sizes.base,
                  marginTop: "0.35rem",
                  paddingLeft: "2.6rem",
                })
              }
            />
          )}
        </div>
      ))}
    </ul>
  );
};

export const MainContentContainer = ({
  sidebar = null,
  narrow = false,
  children,
  ...props
}) => (
  <div
    css={css({
      "@media (min-width: 600px)": {
        margin: "0 auto",
        maxWidth: "100%",
        width: "var(--width)",
        padding: "0 4rem",
      },
      "@media (min-width: 952px)": {
        padding: "0 6rem",
      },
    })}
    style={{ "--width": narrow ? "72rem" : "128rem" }}
    {...props}
  >
    {sidebar == null ? (
      children
    ) : (
      <div
        css={(t) =>
          css({
            "@media (min-width: 952px)": {
              display: "grid",
              gridTemplateColumns: `minmax(0,1fr) ${t.sidebarWidth}`,
              gridGap: "8rem",
              "[data-sidebar-content]": {
                position: "sticky",
                top: 0,
                maxHeight: `calc(100vh - ${t.navBarHeight})`,
                overflow: "auto",
                // Prevents the scrollbar from overlapping the content
                margin: "0 -2rem",
                padding: "0 2rem",
              },
            },
          })
        }
      >
        <div>{children}</div>
        <div>
          <div data-sidebar-content>{sidebar}</div>
        </div>
      </div>
    )}
  </div>
);

export const ProposalLikeContent = ({
  title,
  description,
  createdAt,
  updatedAt,
  proposerId,
  sponsorIds = [],
}) => (
  <div css={css({ userSelect: "text" })}>
    <h1
      css={(t) =>
        css({
          fontSize: t.text.sizes.huge,
          lineHeight: 1.15,
          margin: "0 0 0.3rem",
        })
      }
    >
      {title}
    </h1>
    <div
      css={(t) =>
        css({
          color: t.colors.textDimmed,
          fontSize: t.text.sizes.base,
          margin: "0 0 2.6rem",
        })
      }
    >
      Proposed by <AccountPreviewPopoverTrigger accountAddress={proposerId} />{" "}
      <FormattedDateWithTooltip
        capitalize={false}
        value={createdAt}
        day="numeric"
        month="long"
      />
      {updatedAt != null && updatedAt.getTime() !== createdAt.getTime() && (
        <>
          , last edited{" "}
          <FormattedDateWithTooltip
            capitalize={false}
            value={updatedAt}
            day="numeric"
            month="long"
          />
        </>
      )}
      {sponsorIds.length !== 0 && (
        <>
          <br />
          Sponsored by{" "}
          {sponsorIds.map((id, i) => (
            <React.Fragment key={id}>
              {i !== 0 && <>, </>}
              <AccountPreviewPopoverTrigger accountAddress={id} />
            </React.Fragment>
          ))}
        </>
      )}
    </div>

    <RichText markdownText={description} />
  </div>
);

const ProposalContent = ({ proposalId }) => {
  const proposal = useProposal(proposalId);

  if (proposal == null) return null;

  return (
    <ProposalLikeContent
      title={proposal.title}
      // Slice off the title
      description={proposal.description.slice(
        proposal.description.search(/\n/)
      )}
      proposerId={proposal.proposerId}
      sponsorIds={proposal.signers?.map((s) => s.id)}
      createdAt={proposal.createdTimestamp}
    />
  );
};

export const Layout = ({
  navigationStack = [],
  actions = [],
  scrollView = true,
  children,
}) => (
  <div
    css={(t) =>
      css({
        position: "relative",
        zIndex: 0,
        flex: 1,
        minWidth: "min(30.6rem, 100vw)",
        background: t.colors.backgroundPrimary,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      })
    }
  >
    <NavBar navigationStack={navigationStack} actions={actions} />
    <div
      css={css({
        position: "relative",
        flex: 1,
        display: "flex",
        minHeight: 0,
        minWidth: 0,
      })}
    >
      {scrollView ? (
        <div
          // ref={scrollContainerRef}
          css={css({
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: "scroll",
            overflowX: "hidden",
            minHeight: 0,
            flex: 1,
            overflowAnchor: "none",
          })}
        >
          <div
            css={css({
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              // justifyContent: "flex-end",
              alignItems: "stretch",
              minHeight: "100%",
            })}
          >
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  </div>
);

const ProposalScreen = () => {
  const { proposalId } = useParams();

  const proposal = useProposal(proposalId);

  const [notFound, setNotFound] = React.useState(false);
  const [fetchError, setFetchError] = React.useState(null);

  const { address: connectedWalletAccountAddress } = useWallet();

  const isProposer =
    connectedWalletAccountAddress != null &&
    connectedWalletAccountAddress.toLowerCase() ===
      proposal?.proposerId.toLowerCase();

  const [searchParams, setSearchParams] = useSearchParams();

  const isDialogOpen = searchParams.get("proposal-dialog") != null;

  const openDialog = React.useCallback(() => {
    setSearchParams({ "proposal-dialog": 1 });
  }, [setSearchParams]);

  const closeDialog = React.useCallback(() => {
    setSearchParams((params) => {
      const newParams = new URLSearchParams(params);
      newParams.delete("proposal-dialog");
      return newParams;
    });
  }, [setSearchParams]);

  useProposalFetch(proposalId, {
    onError: (e) => {
      if (e.message === "not-found") {
        setNotFound(true);
        return;
      }

      setFetchError(e);
    },
  });

  return (
    <>
      <Layout
        navigationStack={[
          { to: "/?tab=proposals", label: "Proposals" },
          {
            to: `/${proposalId}`,
            label: (
              <>
                Proposal #{proposalId}
                {proposal?.state != null && (
                  <>
                    {" "}
                    <Tag>{proposal.state}</Tag>
                  </>
                )}
                {/* {proposal != null && ( */}
                {/*   <> */}
                {/*     {" "} */}
                {/*     <Tag>{proposal.status}</Tag> */}
                {/*   </> */}
                {/* )} */}
              </>
            ),
          },
        ]}
        actions={
          isProposer && proposal?.state === "updatable"
            ? [{ onSelect: openDialog, label: "Edit proposal" }]
            : []
        }
      >
        {proposal == null ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              paddingBottom: "10vh",
            }}
          >
            {notFound ? (
              <div>
                <div
                  css={(t) =>
                    css({
                      fontSize: t.text.sizes.headerLarger,
                      fontWeight: t.text.weights.header,
                      margin: "0 0 1.6rem",
                      lineHeight: 1.3,
                    })
                  }
                >
                  Not found
                </div>
                <div
                  css={(t) =>
                    css({
                      fontSize: t.text.sizes.large,
                      wordBreak: "break-word",
                      margin: "0 0 4.8rem",
                    })
                  }
                >
                  Found no proposal with id{" "}
                  <span
                    css={(t) => css({ fontWeight: t.text.weights.emphasis })}
                  >
                    {proposalId}
                  </span>
                  .
                </div>
                <Button
                  component={RouterLink}
                  to="/"
                  variant="primary"
                  size="large"
                >
                  Go back
                </Button>
              </div>
            ) : fetchError != null ? (
              "Something went wrong"
            ) : (
              <Spinner size="2rem" />
            )}
          </div>
        ) : (
          <ProposalMainSection proposalId={proposalId} />
        )}
      </Layout>

      {isDialogOpen && (
        <Dialog
          isOpen={isDialogOpen}
          onRequestClose={closeDialog}
          width="76rem"
        >
          {({ titleProps }) => (
            <ErrorBoundary
              fallback={() => {
                // window.location.reload();
              }}
            >
              <React.Suspense fallback={null}>
                <ProposalDialog
                  proposalId={proposalId}
                  titleProps={titleProps}
                  dismiss={closeDialog}
                />
              </React.Suspense>
            </ErrorBoundary>
          )}
        </Dialog>
      )}
    </>
  );
};

export const VotingBar = ({
  forVotes,
  againstVotes,
  abstainVotes,
  height = "1.2rem",
  pinCount = 60,
  ...props
}) => {
  const totalVoteCount = forVotes + againstVotes + abstainVotes;
  const forFraction = forVotes / totalVoteCount;
  const againstFraction = againstVotes / totalVoteCount;
  return (
    <div
      css={(t) =>
        css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "0.2rem",
          "--for-color": t.colors.textPositive,
          "--against-color": t.colors.textNegative,
          "--undetermined-color": t.colors.borderLight,
          "[data-vote]": { width: "0.3rem", borderRadius: "0.1rem" },
          '[data-vote="for"]': { background: "var(--for-color)" },
          '[data-vote="against"]': { background: "var(--against-color)" },
          '[data-vote="undetermined"]': {
            background: "var(--undetermined-color)",
          },
        })
      }
      style={{ height }}
      {...props}
    >
      {Array.from({ length: pinCount }).map((_, i) => {
        const pinLeftEndFraction = i / pinCount;
        const pinRightEndFraction = (i + 1) / pinCount;

        const isFor = pinRightEndFraction <= forFraction;
        const isAgainst = pinLeftEndFraction >= 1 - againstFraction;
        const isUndetermined = !isFor && !isAgainst;

        const isFirst = i === 0;
        const isLast = i + 1 === pinCount;

        const getSignal = () => {
          if (isFor || (forFraction > 0 && isUndetermined && isFirst))
            return "for";

          if (isAgainst || (againstFraction > 0 && isUndetermined && isLast))
            return "against";

          return "undetermined";
        };

        const signal = getSignal();

        return <div data-vote={signal} key={`${i}-${signal}`} />;
      })}
    </div>
  );
};

const ProposalVoteDistributionToolTipContent = ({ proposalId }) => {
  const proposal = useProposal(proposalId);

  return (
    <VoteDistributionToolTipContent
      votes={{
        for: Number(proposal.forVotes),
        against: Number(proposal.againstVotes),
        abstain: Number(proposal.abstainVotes),
      }}
      delegates={getDelegateVotes(proposal)}
    />
  );
};

export const VoteDistributionToolTipContent = ({ votes, delegates }) => {
  const formatPercentage = (number, total) => {
    if (Number(number) === 0) return "0%";
    const fraction = number / total;
    return `${Math.round(fraction * 100)}%`;
  };

  const voteCount = votes.for + votes.against + votes.abstain;
  const delegateCount =
    delegates == null
      ? null
      : delegates.for + delegates.against + delegates.abstain;

  return (
    <div
      css={(t) =>
        css({
          padding: "1.2rem 1.4rem",
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "auto",
          gridGap: "2rem",
          h1: {
            fontWeight: t.text.weights.emphasis,
            fontSize: t.text.sizes.small,
            margin: "0 0 0.6rem",
            lineHeight: "inherit",
          },
          "[data-positive]": {
            color: t.colors.textPositive,
          },
          "[data-negative]": {
            color: t.colors.textNegative,
          },
          "[data-neutral]": { color: t.colors.textMuted },
          "[data-section]": {
            display: "grid",
            gridTemplateColumns: "auto minmax(0,1fr)",
            gridGap: "1.2rem 0.7rem",
          },
          "[data-section-symbol]": {
            background: t.colors.textMutedAlpha,
            borderRadius: "0.1rem",
          },
          "[data-vote-grid]": {
            display: "grid",
            gridTemplateColumns: "repeat(3, auto)",
            justifyContent: "flex-start",
            gridGap: "0 0.5rem",
          },
        })
      }
    >
      <div data-section>
        <div
          data-section-symbol
          css={css({
            position: "relative",
            top: "0.3rem",
            width: "0.3rem",
            height: "1rem",
          })}
        />
        <div>
          <h1>
            {voteCount} {voteCount === 1 ? "vote" : "votes"}
          </h1>
          <div data-vote-grid>
            <span>{formatPercentage(votes.for, voteCount)}</span>
            <span>({votes.for})</span>
            <span data-positive>for</span>
            <span>{formatPercentage(votes.against, voteCount)}</span>
            <span>({votes.against})</span>
            <span data-negative>against</span>
            {votes.abstain > 0 && (
              <>
                <span>{formatPercentage(votes.abstain, voteCount)}</span>
                <span>({votes.abstain})</span>
                <span data-neutral>abstain</span>
              </>
            )}
          </div>
        </div>
      </div>

      {delegates != null && (
        <div data-section>
          <div
            data-section-symbol
            css={css({
              position: "relative",
              top: "0.7rem",
              width: "0.3rem",
              height: "0.3rem",
            })}
          />
          <div>
            <h1>
              {delegateCount} {delegateCount === 1 ? "delegate" : "delegates"}
            </h1>
            <div data-vote-grid>
              <span>{formatPercentage(delegates.for, delegateCount)}</span>
              <span>({delegates.for})</span>
              <span data-positive>for</span>
              <span>{formatPercentage(delegates.against, delegateCount)}</span>
              <span>({delegates.against})</span>
              <span data-negative>against</span>
              {delegates.abstain > 0 && (
                <>
                  <span>
                    {formatPercentage(delegates.abstain, delegateCount)}
                  </span>
                  <span>({delegates.abstain})</span>
                  <span data-neutral>abstain</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalScreen;
