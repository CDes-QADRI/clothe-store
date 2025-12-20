"use client";

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';

export function AddToCartClient({ product }: { product: Product }) {
	const addItem = useCartStore((s) => s.addItem);
	const sizes = useMemo(() => product.sizes ?? [], [product.sizes]);
	const [selectedSize, setSelectedSize] = useState(() => sizes[0] ?? '4m');

	return (
		<div className="space-y-3">
			{sizes.length > 0 && (
				<div className="space-y-1">
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
						Select metres
					</p>
					<div className="flex flex-wrap gap-2">
						{sizes.map((size) => (
							<button
								key={size}
								type="button"
								onClick={() => setSelectedSize(size)}
								className={
									'rounded-full border px-3 py-1 text-[11px] font-medium transition ' +
									(selectedSize === size
										? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
										: 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700')
								}
							>
								{size}
							</button>
						))}
					</div>
				</div>
			)}

		<Button
			type="button"
			size="lg"
			className="w-full"
			onClick={() => addItem(product, selectedSize)}
		>
			Add to cart
		</Button>
		<p className="text-[11px] text-zinc-500 dark:text-zinc-400">Cash on Delivery checkout.</p>
		</div>
	);
}

