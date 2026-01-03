'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ItemCategory, ItemReview, Place, PlaceReview } from '@/lib/types';
import { FIELD_REPLACE_VALUE } from '@/lib/constants';
import Toast from '@/components/Toast';
import { savePlaceReview } from '@/lib/data';

export type PlaceReviewFormProps = {
  place: Place;
  value: PlaceReview;
  readOnly: boolean;
};

const categories: ItemCategory[] = ['Entree', 'App', 'Dessert', 'Drink'];
const SUBMITTING_TEXT = 'Saving review...';

export default function PlaceReviewForm({ place, value, readOnly }: PlaceReviewFormProps) {
  const [form, setForm] = useState<PlaceReview>(() => ({ ...value }));
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const addItem = () => {
    setForm(
      (prev: PlaceReview): PlaceReview => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: FIELD_REPLACE_VALUE,
            name: '',
            category: 'Entree',
            price: '',
            rating: 0,
            rank: prev.items.length + 1,
            photoUrl: '',
            notes: '',
            createdAt: FIELD_REPLACE_VALUE,
          },
        ],
      }),
    );
  };

  const removeItem = (idx: number) => {
    setForm(
      (prev: PlaceReview): PlaceReview => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== idx),
      }),
    );
  };

  const updateItem = (idx: number, patch: Partial<ItemReview>) => {
    setForm(
      (prev: PlaceReview): PlaceReview => ({
        ...prev,
        items: prev.items.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
      }),
    );
  };

  const setField = <K extends keyof PlaceReview>(key: K, val: PlaceReview[K]) => {
    setForm((prev: PlaceReview): PlaceReview => ({ ...prev, [key]: val }));
  };

  const handleItemFile = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateItem(idx, { photoUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      await savePlaceReview(form);
      setShowSuccessToast(true);
    } catch (err) {
      setError((err as Error).message);
      setShowErrorToast(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      {/* Left panel: hero image and item list akin to Pinterest pin compose */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body gap-4">
          <figure className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-base-300 ring-1 ring-base-300/50">
            <Image src={place.photoUrl} alt={place.name} fill className="object-cover" />
          </figure>
          <div className="divider my-0"></div>
          <h3 className="card-title">{place.name}</h3>
          <p className="text-sm text-base-content/70">{place.address}</p>
        </div>
      </div>

      {/* Right panel: overall review meta */}
      <div className="card bg-base-200 shadow-sm h-max">
        <div className="card-body gap-4">
          <h3 className="card-title">Overall</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="form-control flex flex-col">
              <label className="label" htmlFor="place-rating">
                <span className="text-xs ml-1 text-base-content/60">Overall Rating (0 to 5)</span>
              </label>
              <input
                id="place-rating"
                type="number"
                name="place-rating"
                min={0}
                max={5}
                step={1}
                className={`input input-bordered`}
                value={form.rating}
                onChange={(e) => setField('rating', Number(e.target.value))}
                disabled={readOnly}
              />
            </div>

            <div className="form-control flex flex-col">
              <label className="label" htmlFor="place-rank">
                <span className="text-xs ml-1 text-base-content/60">Overall Rank</span>
              </label>
              <input
                id="place-rank"
                type="number"
                name="place-rank"
                min={1}
                className="input input-bordered"
                value={form.rank}
                onChange={(e) => setField('rank', Number(e.target.value))}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="divider"></div>

          <h3 className="text-lg font-semibold">Items</h3>

          <div className="flex flex-col gap-4">
            {form.items.length === 0 && (
              <div className="text-sm text-base-content/60">No items yet. Add your first dish/drink.</div>
            )}
            {form.items.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-base-300 p-4 bg-base-100">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-base-200">
                    {item.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photoUrl} alt={item.name || 'Item'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs text-base-content/60">No photo</div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <label className="form-control">
                      <div className="label">
                        <span className="text-xs ml-1">Name</span>
                      </div>
                      <input
                        className={`input input-bordered input-sm`}
                        name={`item-${idx}-name`}
                        value={item.name}
                        onChange={(e) => updateItem(idx, { name: e.target.value })}
                        placeholder="e.g., Margherita Pizza"
                        disabled={readOnly}
                      />
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="text-xs ml-1">Category</span>
                      </div>
                      <select
                        className={`select select-bordered select-sm`}
                        value={item.category}
                        onChange={(e) => updateItem(idx, { category: e.target.value as ItemCategory })}
                        disabled={readOnly}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="text-xs ml-1">Price</span>
                      </div>
                      <input
                        className="input input-bordered input-sm"
                        name={`item-${idx}-price`}
                        value={item.price}
                        onChange={(e) => updateItem(idx, { price: e.target.value })}
                        placeholder="$12.50"
                        disabled={readOnly}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="form-control">
                        <div className="label">
                          <span className="text-xs ml-1">Rating (0 to 5)</span>
                        </div>
                        <input
                          type="number"
                          name={`item-${idx}-rating`}
                          min={0}
                          max={5}
                          step={1}
                          className={`input input-bordered input-sm`}
                          value={item.rating}
                          onChange={(e) => updateItem(idx, { rating: Number(e.target.value) })}
                          disabled={readOnly}
                        />
                      </label>

                      <label className="form-control">
                        <div className="label">
                          <span className="text-xs ml-1">Rank</span>
                        </div>
                        <input
                          type="number"
                          name={`item-${idx}-rank`}
                          min={1}
                          className="input input-bordered input-sm"
                          value={item.rank}
                          onChange={(e) => updateItem(idx, { rank: Number(e.target.value) })}
                          disabled={readOnly}
                        />
                      </label>
                    </div>

                    {!readOnly && (
                      <div className="md:col-span-2 flex items-center gap-3">
                        <input
                          id={`item_file_${idx}`}
                          name={`item-${idx}-photo`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleItemFile(idx, e)}
                        />
                        <label htmlFor={`item_file_${idx}`} className="btn btn-sm">
                          Upload photo
                        </label>
                        <span className="text-xs text-base-content/60">JPG, PNG, or GIF</span>
                      </div>
                    )}

                    <label className="form-control flex flex-col md:col-span-2">
                      <div className="label">
                        <span className="text-xs ml-1.5">Notes</span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered textarea-sm"
                        name={`item-${idx}-notes`}
                        value={item.notes}
                        onChange={(e) => updateItem(idx, { notes: e.target.value })}
                        placeholder="Tasting notes, preparation, what you liked..."
                        disabled={readOnly}
                      />
                    </label>
                  </div>

                  <div className="shrink-0">
                    {!readOnly && (
                      <button type="button" className="btn btn-ghost btn-xs" onClick={() => removeItem(idx)}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row-reverse">
            {!readOnly && (
              <button type="button" className="btn btn-sm btn-secondary" onClick={addItem} aria-label="Add item">
                + Add item
              </button>
            )}
          </div>

          <div className="divider" />

          {!readOnly && (
            <button type="submit" className={`btn btn-primary ${isPending ? 'btn-disabled' : ''}`} disabled={isPending}>
              {isPending ? SUBMITTING_TEXT : 'Save Review'}
            </button>
          )}
        </div>
      </div>
      {showSuccessToast ? (
        <Toast message="Saved place review!" type="success" onClose={() => setShowSuccessToast(false)} />
      ) : null}
      {error && showErrorToast ? <Toast message={error} type="error" onClose={() => setShowErrorToast(false)} /> : null}
    </form>
  );
}
