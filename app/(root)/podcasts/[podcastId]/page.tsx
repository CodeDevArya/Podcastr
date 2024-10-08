"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastDetails = ({
  params: { podcastId },
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const { user } = useUser();

  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });

  const SimilarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId,
  });

  if (!SimilarPodcasts || !podcast) return <LoaderSpinner />;

  const isOwner = user?.id === podcast?.authorId;

  return (
    <section className="flex w-full flex-col mb-10">
      <header className="mt-9 flex item-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3 object-cover">
          <Image
            src={"/icons/headphone.svg"}
            width={24}
            height={24}
            alt="headphones"
            className="object-cover"
          />
          <h2 className="text-16 font-bold text-white-1 ">{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer
        isOwner={isOwner}
        podcastId={podcast._id}
        {...podcast}
      />

      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <div className="flex flex-col gap-8">
        {podcast?.voicePrompt && (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">
              Audio Description
            </h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.voicePrompt
                ? podcast.voicePrompt
                : "No Audio Description."}
            </p>
          </div>
        )}
        {podcast?.imagePrompt && (
          <div className="flex flex-col gap-4">
            <h1 className="text-18 font-bold text-white-1">
              Image Description
            </h1>
            <p className="text-16 font-medium text-white-2">
              {podcast?.imagePrompt
                ? podcast.imagePrompt
                : "No Image Description."}
            </p>
          </div>
        )}
      </div>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar Podcast</h1>
        {SimilarPodcasts && SimilarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {SimilarPodcasts?.map(
              ({ _id, podcastTitle, imageUrl, podcastDescription }) => (
                <PodcastCard
                  key={_id}
                  imgUrl={imageUrl!}
                  title={podcastTitle}
                  description={podcastDescription}
                  podcastId={_id}
                />
              )
            )}
          </div>
        ) : (
          <div>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcast"
            />
          </div>
        )}
      </section>
    </section>
  );
};

export default PodcastDetails;
