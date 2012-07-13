<?php require_once 'framework.php'; ?>
<?php get_header('Hebrew | Now Studying | Sleepless Demo', '', 'study-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front">
			<span class="card-field center-field rtl">בקבוק</span>
			<span class="card-field small-field center-field">bokbuk</span>
		</div>
	</section>
	<section id="back" class="fade-in">
		<div class="card one-sided-card">
			<div class="card-back">
				<span class="card-field small-field center-field">bottle</span>
			</div>
		</div>
		
		<form method="post" action="question3.php" class="study-levels">
			<input type="submit" name="study-l0" value="Repeat" class="btn bad-btn large-btn" id="study-l0" />
			<input type="submit" name="study-l1" value="Bad" class="btn good-btn large-btn" id="study-l1" />
			<input type="submit" name="study-l2" value="Good" class="btn good-btn large-btn" id="study-l2" />
			<input type="submit" name="study-l3" value="Excellent" class="btn good-btn large-btn" id="study-l3" />
		</form>
	</section>
<?php get_footer('study'); ?>