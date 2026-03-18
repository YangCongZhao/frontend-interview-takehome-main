## 发现的问题
1. components/BookingGrid/RoomRow.tsx 页面中 `BookingDrawer` 方法 声明调用顺序错误。
2. pages/messages/index.tsx 中 getServerSideProps 造成重复的ssr渲染
   ```javascript
    export const getServerSideProps: GetServerSideProps = async (context) => {
    const ticketId = (context.query.ticketId as string) ?? null
    return {
        props: {
        initialTicketId: ticketId,
          },
        }
    }
    ```
 3. Booking Calendar页面显示不足30天 切换分辨率刷新后 还是无法全部显示。

## 应用的修复
1.   箭头函数先声明后调用
2.   pages/messages/index.tsx  handleTicketClick中使用了 router.push。 数据通过 useSWR获取的tickets。可以直接使用客户端CSR的切换方式就可以，也就是dom切换。但是使用了getServerSideProps 每次点击 messages list item 会请求一次服务器 `造成重复ssr` 删掉getServerSideProps
3.   hooks/useVisibleRange.ts  useVisibleRange hook VISIBLE_COLUMNS将显示页数固定死14列。导致无法显示完整。 修改为获取当前的dom ref 根据clientWidth动态计算列 
## 权衡取舍

## 如果有更多时间
