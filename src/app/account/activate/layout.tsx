export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-white flex flex-col absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[45%]">
                {children}
            </body>
        </html>
    )
}
