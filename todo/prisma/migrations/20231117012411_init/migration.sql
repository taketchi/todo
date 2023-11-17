-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "todo" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL,
    "editing" BOOLEAN NOT NULL
);
