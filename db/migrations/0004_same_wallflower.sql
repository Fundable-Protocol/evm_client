
CREATE TABLE "FeeConfig" (
	"id" text PRIMARY KEY NOT NULL,
	"network" "network" NOT NULL,
	"chain_id" text NOT NULL,
	"chain_name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	CONSTRAINT "FeeConfig_chain_name_network_chain_id_unique" UNIQUE("chain_name","network","chain_id")
);

DROP INDEX "UserAccess_userId_key";--> statement-breakpoint
DROP INDEX "Session_tokenHash_key";--> statement-breakpoint
DROP INDEX "Session_userId_fingerprintHash_key";--> statement-breakpoint
DROP INDEX "Session_userId_idx";--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "Distribution" ADD COLUMN "usd_rate" numeric(65, 30) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "Distribution" ADD COLUMN "total_usd_amount" numeric(65, 30) DEFAULT '0';--> statement-breakpoint
CREATE UNIQUE INDEX "UserAccess_userId_key" ON "UserAccess" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session" USING btree ("token_hash" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Session_userId_fingerprintHash_key" ON "Session" USING btree ("user_id" text_ops,"fingerprint_hash" text_ops);--> statement-breakpoint
CREATE INDEX "Session_userId_idx" ON "Session" USING btree ("user_id" text_ops);--> statement-breakpoint
