import { MainController } from "./controller/MainController"

export const Routes = [
    // user rates expert
{
    method: "get",
    route: "/comments-expert",
    controller: MainController,
    action: "userRatesExpertAll"
}, {
    method: "get",
    route: "/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertOne"
}, {
    method: "post",
    route: "/comments-expert",
    controller: MainController,
    action: "userRatesExpertSave"
}, {
    method: "patch",
    route: "/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertUpdate"
}, {
    method: "delete",
    route: "/comments-expert/:id",
    controller: MainController,
    action: "userRatesExpertRemove"
}, 
    // user rates store
{
    method: "get",
    route: "/comments-store",
    controller: MainController,
    action: "userRatesStoreAll"
}, {
    method: "get",
    route: "/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreOne"
}, {
    method: "post",
    route: "/comments-store",
    controller: MainController,
    action: "userRatesStoreSave"
}, {
    method: "patch",
    route: "/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreUpdate"
}, {
    method: "delete",
    route: "/comments-store/:id",
    controller: MainController,
    action: "userRatesStoreRemove"
// food comments
}, {
    method: "get",
    route: "/comments-food",
    controller: MainController,
    action: "userCommentsFoodAll"
}, {
    method: "get",
    route: "/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodOne"
}, {
    method: "post",
    route: "/comments-food",
    controller: MainController,
    action: "userCommentsFoodSave"
}, {
    method: "patch",
    route: "/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodUpdate"
}, {
    method: "delete",
    route: "/comments-food/:id",
    controller: MainController,
    action: "userCommentsFoodRemove"
}]