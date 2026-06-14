-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "searchCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "category" TEXT,
    "learningLevel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "thumbnail" TEXT,
    "author" TEXT,
    "duration" TEXT,
    "language" TEXT,
    "rating" DOUBLE PRECISION,
    "rank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "searchId" TEXT NOT NULL,

    CONSTRAINT "SearchResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "preferredLevel" TEXT,
    "preferredSources" JSONB,
    "preferredDuration" TEXT,
    "favoriteTopics" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnalytics" (
    "id" TEXT NOT NULL,
    "totalSearches" INTEGER NOT NULL DEFAULT 0,
    "totalResourcesViewed" INTEGER NOT NULL DEFAULT 0,
    "totalResourcesSaved" INTEGER NOT NULL DEFAULT 0,
    "favoriteTopic" TEXT,
    "lastActivity" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceInteraction" (
    "id" TEXT NOT NULL,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "saved" BOOLEAN NOT NULL DEFAULT false,
    "resourceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResourceInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_providerId_key" ON "User"("provider", "providerId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_idx" ON "SearchHistory"("userId");

-- CreateIndex
CREATE INDEX "SearchHistory_query_idx" ON "SearchHistory"("query");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE INDEX "SearchResource_searchId_idx" ON "SearchResource"("searchId");

-- CreateIndex
CREATE INDEX "SearchResource_source_idx" ON "SearchResource"("source");

-- CreateIndex
CREATE INDEX "SearchResource_type_idx" ON "SearchResource"("type");

-- CreateIndex
CREATE INDEX "SavedResource_userId_idx" ON "SavedResource"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedResource_userId_url_key" ON "SavedResource"("userId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnalytics_userId_key" ON "UserAnalytics"("userId");

-- CreateIndex
CREATE INDEX "ResourceInteraction_userId_idx" ON "ResourceInteraction"("userId");

-- CreateIndex
CREATE INDEX "ResourceInteraction_resourceUrl_idx" ON "ResourceInteraction"("resourceUrl");

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchResource" ADD CONSTRAINT "SearchResource_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "SearchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedResource" ADD CONSTRAINT "SavedResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnalytics" ADD CONSTRAINT "UserAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceInteraction" ADD CONSTRAINT "ResourceInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
