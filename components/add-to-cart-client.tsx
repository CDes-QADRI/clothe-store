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
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
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
										? 'border-slate-900 bg-slate-900 text-white'
										: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
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
		<p className="text-[11px] text-slate-500">Cash on Delivery checkout.</p>
		</div>
	);
}

